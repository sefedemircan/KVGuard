export interface OCRResult {
  text: string;
  confidence: number;
  processingTimeMs: number;
}

export class OCREngine {
  // OpenRouter Vision API kullanarak görsel işleme
  private async extractWithVisionAPI(buffer: Buffer): Promise<string> {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY bulunamadı');
    }
    
    try {
      // Buffer'ı base64'e çevir
      const base64Image = buffer.toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'KVGuard - OCR Engine'
        },
        body: JSON.stringify({
          model: 'x-ai/grok-4-fast:free',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Bu görseldeki tüm metni aynen çıkar. Sadece metni döndür, hiçbir yorum ekleme. Türkçe karakterleri doğru şekilde tanı.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: dataUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 4000,
          temperature: 0.1
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Vision API error:', errorText);
        throw new Error(`Vision API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      const extractedText = data.choices[0]?.message?.content || '';
      
      console.log('Vision API extraction successful, text length:', extractedText.length);
      return extractedText;
      
    } catch (error) {
      console.error('Vision API error:', error);
      throw new Error('Görsel işleme sırasında hata oluştu');
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
  
  // Görsel dosyalardan OCR ile metin çıkar (Vision API kullanarak)
  async extractFromImage(buffer: Buffer, mimeType: string): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      console.log('Extracting text from image using Vision API...');
      const text = await this.extractWithVisionAPI(buffer);
      
      return {
        text: text,
        confidence: 0.95, // Vision API genellikle yüksek güvenilirlik sağlar
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
  
  // Cleanup - Vision API için gerekli değil
  async cleanup(): Promise<void> {
    // Vision API için cleanup gerekmez
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
