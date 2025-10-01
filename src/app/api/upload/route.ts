import { NextRequest, NextResponse } from 'next/server';
import { DetectionEngine } from '@/lib/detection/detection-engine';
import { OCREngine } from '@/lib/ocr/ocr-engine';
import { DatabaseService } from '@/lib/supabase';
import { PersonalDataType, ProcessedFile, AuditLog } from '@/lib/models';

// Lazy initialize engines to avoid startup errors

export async function POST(request: NextRequest) {
  console.log('Upload API called');
  let processedFile: ProcessedFile | null = null;
  let ocrEngine: OCREngine | null = null;

  try {
    console.log('Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('File received:', file?.name, file?.type, file?.size);
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }
    
    // Dosya boyutu kontrolü (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Dosya boyutu çok büyük (max 10MB)' },
        { status: 400 }
      );
    }

    // Dosya türü kontrolü
    if (!OCREngine.isSupportedFileType(file.type, file.name)) {
      return NextResponse.json(
        { error: 'Desteklenmeyen dosya türü' },
        { status: 400 }
      );
    }
    
    const startTime = Date.now();
    const buffer = Buffer.from(await file.arrayBuffer());
    
    console.log('Initializing engines...');
    // Initialize engines here to catch any errors
    const detectionEngine = new DetectionEngine();
    ocrEngine = new OCREngine();
    
    // İlk olarak veritabanına processing durumunda kayıt oluştur
    const uploadDate = new Date();
    processedFile = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadDate: uploadDate,
      processedDate: uploadDate,
      originalText: '',
      maskedText: '',
      detectedData: [],
      status: 'processing'
    };

    console.log('Creating database record...');
    // Veritabanına kaydet
    const dbRecord = await DatabaseService.createProcessedFile(processedFile);
    const fileId = dbRecord.id as string;
    console.log('Database record created:', fileId);
    
    try {
      console.log('Starting OCR extraction...');
      // OCR ile metin çıkar
      const ocrResult = await ocrEngine.extractText(buffer, file.type, file.name);
      console.log('OCR completed, text length:', ocrResult.text.length);
      
      console.log('Starting detection...');
      // Kişisel verileri tespit et
      const detectionResult = await detectionEngine.detect(ocrResult.text);
      console.log('Detection completed, found:', detectionResult.detectedData.length, 'items');
      
      const processedDate = new Date();
      const processingTimeMs = Date.now() - startTime;
      
      // Veritabanı kaydını güncelle
      const updatedRecord = await DatabaseService.updateProcessedFile(fileId, {
        originalText: ocrResult.text,
        maskedText: detectionResult.maskedText,
        detectedData: detectionResult.detectedData,
        status: 'completed',
        processedDate: processedDate
      });

      // Her tespit edilen veri için audit log oluştur
      const clientIP = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      for (const detectedItem of detectionResult.detectedData) {
        const auditLog: AuditLog = {
          fileId: fileId,
          fileName: file.name,
          dataType: detectedItem.type,
          originalValue: detectedItem.originalValue,
          maskedValue: detectedItem.maskedValue,
          detectionMethod: 'hybrid', // Hem regex hem NLP kullanıyoruz
          confidence: detectedItem.confidence,
          timestamp: processedDate,
          ipAddress: clientIP,
          userAgent: userAgent
        };
        
        try {
          await DatabaseService.createAuditLog(auditLog);
        } catch (auditError) {
          console.error('Audit log creation failed:', auditError);
          // Audit log hatası ana işlemi durdurmasın
        }
      }

      // İstatistikleri güncelle
      try {
        await updateDailyStatistics(processedDate, detectionResult.detectedData, processingTimeMs);
      } catch (statsError) {
        console.error('Statistics update failed:', statsError);
        // İstatistik hatası ana işlemi durdurmasın
      }
      
      console.log('File processed successfully', {
        fileId: fileId,
        fileName: file.name,
        detectedDataCount: detectionResult.detectedData.length,
        processingTime: processingTimeMs,
        ocrConfidence: ocrResult.confidence
      });
      
      return NextResponse.json({
        success: true,
        fileId: fileId,
        originalText: ocrResult.text,
        maskedText: detectionResult.maskedText,
        detectedData: detectionResult.detectedData,
        ocrConfidence: ocrResult.confidence,
        processingTimeMs: processingTimeMs
      });
      
    } catch (processingError) {
      console.error('Processing error:', processingError);
      
      // Hata durumunu veritabanına kaydet
      if (fileId) {
        try {
          await DatabaseService.updateProcessedFile(fileId, {
            status: 'error',
            errorMessage: processingError instanceof Error ? processingError.message : 'Bilinmeyen hata'
          });
        } catch (dbError) {
          console.error('Failed to update error status in database:', dbError);
        }
      }
      
      throw processingError;
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    
    // Detaylı hata bilgisi
    let errorMessage = 'Dosya işlenirken hata oluştu';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
      console.error('Error details:', errorDetails);
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
    } finally {
      // OCR engine cleanup
      try {
        if (ocrEngine) {
          await ocrEngine.cleanup();
        }
      } catch (cleanupError) {
        console.error('OCR cleanup error:', cleanupError);
      }
    }
}

// İstatistikleri güncelleme fonksiyonu
async function updateDailyStatistics(date: Date, detectedData: any[], processingTimeMs: number) {
  console.log('Updating daily statistics...', {
    date: date.toISOString(),
    detectedDataCount: detectedData.length,
    processingTimeMs
  });

  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Veri türü breakdown'unu hazırla
  const dataTypeBreakdown: { [key in PersonalDataType]: number } = {
    [PersonalDataType.TC_KIMLIK]: 0,
    [PersonalDataType.IBAN]: 0,
    [PersonalDataType.TELEFON]: 0,
    [PersonalDataType.KREDI_KARTI]: 0,
    [PersonalDataType.ADRES]: 0,
    [PersonalDataType.ISIM]: 0,
    [PersonalDataType.SAGLIK_VERISI]: 0,
    [PersonalDataType.EMAIL]: 0,
    [PersonalDataType.DOGUM_TARIHI]: 0
  };

  // Tespit edilen verileri say
  detectedData.forEach(item => {
    if (item.type && item.type in dataTypeBreakdown) {
      dataTypeBreakdown[item.type as PersonalDataType]++;
    }
  });

  console.log('Data type breakdown:', dataTypeBreakdown);

  // Ortalama güven skorunu hesapla
  const averageConfidence = detectedData.length > 0 
    ? detectedData.reduce((sum, item) => sum + item.confidence, 0) / detectedData.length
    : 0;

  console.log('Average confidence:', averageConfidence);

  try {
    // Mevcut günün istatistiklerini al
    const existingStats = await DatabaseService.getStatistics(today, today);
    console.log('Existing stats found:', existingStats?.length || 0);
    
    if (existingStats && existingStats.length > 0) {
      // Mevcut istatistikleri güncelle
      const current = existingStats[0] as any;
      const newTotalFiles = current.total_files_processed + 1;
      const newTotalData = current.total_data_detected + detectedData.length;
      
      // Veri türü breakdown'unu güncelle
      const currentBreakdown = current.data_type_breakdown || {};
      Object.entries(dataTypeBreakdown).forEach(([type, count]) => {
        currentBreakdown[type] = (currentBreakdown[type] || 0) + count;
      });
      
      // Ortalama güven ve işlem süresini güncelle
      const newAverageConfidence = ((current.average_confidence * (newTotalFiles - 1)) + averageConfidence) / newTotalFiles;
      const newProcessingTime = ((current.processing_time_ms * (newTotalFiles - 1)) + processingTimeMs) / newTotalFiles;

      console.log('Updating existing statistics:', {
        newTotalFiles,
        newTotalData,
        newAverageConfidence,
        newProcessingTime: Math.round(newProcessingTime)
      });

      await DatabaseService.createOrUpdateStatistics({
        date: today,
        totalFilesProcessed: newTotalFiles,
        totalDataDetected: newTotalData,
        dataTypeBreakdown: currentBreakdown,
        averageConfidence: newAverageConfidence,
        processingTimeMs: Math.round(newProcessingTime)
      });
    } else {
      // Yeni istatistik kaydı oluştur
      console.log('Creating new statistics record:', {
        totalFilesProcessed: 1,
        totalDataDetected: detectedData.length,
        averageConfidence,
        processingTimeMs
      });

      await DatabaseService.createOrUpdateStatistics({
        date: today,
        totalFilesProcessed: 1,
        totalDataDetected: detectedData.length,
        dataTypeBreakdown: dataTypeBreakdown,
        averageConfidence: averageConfidence,
        processingTimeMs: processingTimeMs
      });
    }

    console.log('Statistics updated successfully');
  } catch (error) {
    console.error('Error updating statistics:', error);
    throw error; // Re-throw to be caught by the calling function
  }
}
