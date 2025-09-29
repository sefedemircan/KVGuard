import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const format = searchParams.get('format') || 'json';
    const includeOriginal = searchParams.get('includeOriginal') === 'true';

    if (!fileId) {
      return NextResponse.json(
        { error: 'Dosya ID gerekli' },
        { status: 400 }
      );
    }

    // Dosya bilgilerini al
    const processedFile = await DatabaseService.getProcessedFile(fileId);
    if (!processedFile) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 404 }
      );
    }

    // Audit loglarını al
    const auditLogs = await DatabaseService.getAuditLogs(fileId);

    // Export verisini hazırla
    const exportData = {
      file: {
        id: processedFile.id,
        fileName: processedFile.file_name,
        fileType: processedFile.file_type,
        fileSize: processedFile.file_size,
        uploadDate: processedFile.upload_date,
        processedDate: processedFile.processed_date,
        status: processedFile.status
      },
      analysis: {
        detectedDataCount: processedFile.detected_data?.length || 0,
        detectedData: processedFile.detected_data || [],
        maskedText: processedFile.masked_text
      },
      auditTrail: auditLogs.map(log => ({
        id: log.id,
        dataType: log.data_type,
        maskedValue: log.masked_value,
        detectionMethod: log.detection_method,
        confidence: log.confidence,
        timestamp: log.timestamp,
        ipAddress: log.ip_address,
        userAgent: log.user_agent
      })),
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        exportFormat: format,
        includesOriginalText: includeOriginal
      }
    };

    // Eğer orijinal metin dahil edilecekse ekle
    if (includeOriginal) {
      (exportData.analysis as any).originalText = processedFile.original_text;
    }

    // Format'a göre response döndür
    switch (format.toLowerCase()) {
      case 'csv':
        return generateCSVResponse(exportData, processedFile.file_name);
      
      case 'txt':
        return generateTXTResponse(exportData, processedFile.file_name);
      
      case 'json':
      default:
        return NextResponse.json(exportData, {
          headers: {
            'Content-Disposition': `attachment; filename="${processedFile.file_name}_analysis.json"`,
            'Content-Type': 'application/json'
          }
        });
    }

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Dışa aktarım sırasında hata oluştu' },
      { status: 500 }
    );
  }
}

function generateCSVResponse(exportData: any, fileName: string) {
  // CSV başlıkları
  const csvHeaders = [
    'Veri Türü',
    'Maskelenmiş Değer',
    'Tespit Yöntemi',
    'Güven Skoru',
    'Zaman Damgası',
    'IP Adresi'
  ].join(',');

  // CSV satırları
  const csvRows = exportData.auditTrail.map((log: any) => [
    log.dataType,
    `"${log.maskedValue}"`,
    log.detectionMethod,
    log.confidence,
    log.timestamp,
    log.ipAddress || 'N/A'
  ].join(','));

  const csvContent = [csvHeaders, ...csvRows].join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fileName}_analysis.csv"`
    }
  });
}

function generateTXTResponse(exportData: any, fileName: string) {
  const txtContent = `
KVGuard Kişisel Veri Analiz Raporu
==================================

Dosya Bilgileri:
- Dosya Adı: ${exportData.file.fileName}
- Dosya Türü: ${exportData.file.fileType}
- Dosya Boyutu: ${exportData.file.fileSize} bytes
- Yüklenme Tarihi: ${exportData.file.uploadDate}
- İşlenme Tarihi: ${exportData.file.processedDate}
- Durum: ${exportData.file.status}

Analiz Sonuçları:
- Tespit Edilen Veri Sayısı: ${exportData.analysis.detectedDataCount}

Tespit Edilen Kişisel Veriler:
${exportData.analysis.detectedData.map((item: any, index: number) => `
${index + 1}. ${item.type}
   - Maskelenmiş Değer: ${item.maskedValue}
   - Güven Skoru: ${(item.confidence * 100).toFixed(1)}%
   - Pozisyon: ${item.position.start}-${item.position.end}
`).join('')}

Maskelenmiş Metin:
${exportData.analysis.maskedText}

Denetim İzi:
${exportData.auditTrail.map((log: any, index: number) => `
${index + 1}. ${log.dataType} - ${log.detectionMethod}
   - Zaman: ${log.timestamp}
   - IP: ${log.ipAddress || 'N/A'}
   - Güven: ${(log.confidence * 100).toFixed(1)}%
`).join('')}

Rapor Oluşturma Zamanı: ${exportData.exportMetadata.exportedAt}
`.trim();

  return new NextResponse(txtContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}_analysis.txt"`
    }
  });
}
