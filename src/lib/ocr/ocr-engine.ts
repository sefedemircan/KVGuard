// Dynamic imports to avoid build issues
// import { createWorker, Worker } from 'tesseract.js';
// import * as pdfParse from 'pdf-parse';

export interface OCRResult {
  text: string;
  confidence: number;
  processingTimeMs: number;
}

export class OCREngine {
  private worker: any | null = null;
  
  // Tesseract.js worker'ını başlat
  private async initializeWorker(): Promise<any> {
    if (this.worker) return this.worker;
    
    try {
      const { createWorker } = await import('tesseract.js');
      this.worker = await createWorker('tur+eng'); // Türkçe + İngilizce dil desteği
      
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZabcçdefgğhıijklmnoöprsştuüvyz0123456789.,!?()[]{}/@#$%^&*-+=_~|\\:;"\'<> \n\t',
        preserve_interword_spaces: '1',
      });
      
      return this.worker;
    } catch (error) {
      console.error('Failed to initialize Tesseract worker:', error);
      throw new Error('OCR engine initialization failed');
    }
  }
  
  // PDF dosyasından metin çıkar
  async extractFromPDF(buffer: Buffer): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      const pdfParse = await import('pdf-parse');
      const data = await pdfParse.default(buffer);
      
      return {
        text: data.text,
        confidence: 1.0, // PDF'den metin çıkarma güvenilir
        processingTimeMs: Date.now() - startTime
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('PDF dosyası işlenirken hata oluştu');
    }
  }
  
  // Görsel dosyalardan OCR ile metin çıkar
  async extractFromImage(buffer: Buffer, mimeType: string): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      const worker = await this.initializeWorker();
      
      // Buffer'ı Uint8Array'e dönüştür
      const imageData = new Uint8Array(buffer);
      
      const { data } = await worker.recognize(imageData);
      
      return {
        text: data.text,
        confidence: data.confidence / 100, // Tesseract 0-100 arası döndürür, 0-1'e dönüştür
        processingTimeMs: Date.now() - startTime
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      throw new Error('Görsel dosya işlenirken hata oluştu');
    }
  }
  
  // Metin dosyasından metin çıkar
  extractFromText(buffer: Buffer): OCRResult {
    const startTime = Date.now();
    
    try {
      // UTF-8 encoding ile metin çıkar
      const text = buffer.toString('utf-8');
      
      return {
        text,
        confidence: 1.0, // Metin dosyası güvenilir
        processingTimeMs: Date.now() - startTime
      };
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Metin dosyası işlenirken hata oluştu');
    }
  }
  
  // Dosya türüne göre uygun çıkarma yöntemini seç
  async extractText(buffer: Buffer, mimeType: string, fileName: string): Promise<OCRResult> {
    const fileExtension = fileName.toLowerCase().split('.').pop();
    
    // PDF dosyası
    if (mimeType === 'application/pdf' || fileExtension === 'pdf') {
      return this.extractFromPDF(buffer);
    }
    
    // Metin dosyaları
    if (mimeType.startsWith('text/') || ['txt', 'csv', 'log'].includes(fileExtension || '')) {
      return this.extractFromText(buffer);
    }
    
    // Görsel dosyalar
    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'].includes(fileExtension || '')) {
      return this.extractFromImage(buffer, mimeType);
    }
    
    throw new Error(`Desteklenmeyen dosya türü: ${mimeType}`);
  }
  
  // Worker'ı temizle
  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
  
  // Desteklenen dosya türlerini kontrol et
  static isSupportedFileType(mimeType: string, fileName: string): boolean {
    const fileExtension = fileName.toLowerCase().split('.').pop();
    
    const supportedMimeTypes = [
      'application/pdf',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/bmp',
      'image/tiff',
      'image/gif'
    ];
    
    const supportedExtensions = [
      'pdf', 'txt', 'csv', 'log',
      'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'
    ];
    
    return supportedMimeTypes.includes(mimeType) || 
           supportedExtensions.includes(fileExtension || '');
  }
}
