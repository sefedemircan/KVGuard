import { NextRequest, NextResponse } from 'next/server';
import { PersonalDataType } from '@/lib/models';

// Basit regex patterns for testing
const SIMPLE_PATTERNS = {
  TC_KIMLIK: /\b[1-9]\d{10}\b/g,
  IBAN: /\bTR\d{24}\b/gi,
  TELEFON: /(\+90|0)?\s?(\(\d{3}\)|\d{3})\s?\d{3}\s?\d{2}\s?\d{2}/g,
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  KREDI_KARTI: /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g
};

function maskValue(value: string, type: string): string {
  switch (type) {
    case 'TC_KIMLIK':
      return `${value.slice(0, 3)}****${value.slice(-3)}`;
    case 'IBAN':
      return `${value.slice(0, 8)}****${value.slice(-4)}`;
    case 'TELEFON':
      const cleaned = value.replace(/\D/g, '');
      return `${cleaned.slice(0, 3)}****${cleaned.slice(-2)}`;
    case 'EMAIL':
      const [local, domain] = value.split('@');
      const maskedLocal = local.length > 2 
        ? `${local.slice(0, 2)}****${local.slice(-1)}`
        : '****';
      return `${maskedLocal}@${domain}`;
    case 'KREDI_KARTI':
      const cleanedCard = value.replace(/\s/g, '');
      return `${cleanedCard.slice(0, 4)} **** **** ${cleanedCard.slice(-4)}`;
    default:
      return '*'.repeat(value.length);
  }
}

function detectPersonalData(text: string) {
  const detected: any[] = [];
  
  Object.entries(SIMPLE_PATTERNS).forEach(([type, pattern]) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    
    while ((match = regex.exec(text)) !== null) {
      const originalValue = match[0];
      detected.push({
        type: PersonalDataType[type as keyof typeof PersonalDataType],
        originalValue,
        maskedValue: maskValue(originalValue, type),
        position: {
          start: match.index,
          end: match.index + originalValue.length
        },
        confidence: 0.9
      });
    }
  });
  
  return detected;
}

function applyMasking(text: string, detected: any[]): string {
  let maskedText = text;
  
  // Sondan başlayarak maskeleme uygula
  const sortedByPosition = detected.sort((a, b) => b.position.start - a.position.start);
  
  for (const item of sortedByPosition) {
    maskedText = maskedText.slice(0, item.position.start) + 
                item.maskedValue + 
                maskedText.slice(item.position.end);
  }
  
  return maskedText;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
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
    
    const startTime = Date.now();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = 'mock-file-' + Date.now();
    
    try {
      // Basit metin çıkarma
      let text = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
        text = buffer.toString('utf-8');
      } else {
        // Diğer dosya türleri için placeholder
        text = `[${file.name} dosyasından çıkarılan metin]
        
Bu bir test dosyasıdır. Gerçek OCR işlemi için:
- TC: 12345678901
- Telefon: 0532 123 45 67
- Email: test@example.com
- IBAN: TR33 0006 1005 1978 6457 8413 26
- Kredi Kartı: 4532 1234 5678 9012`;
      }
      
      // Kişisel verileri tespit et
      const detectedData = detectPersonalData(text);
      const maskedText = applyMasking(text, detectedData);
      const processingTimeMs = Date.now() - startTime;
      
      console.log('Mock: File processed successfully', {
        fileName: file.name,
        detectedDataCount: detectedData.length,
        processingTime: processingTimeMs
      });
      
      return NextResponse.json({
        success: true,
        fileId: fileId,
        originalText: text,
        maskedText: maskedText,
        detectedData: detectedData,
        ocrConfidence: file.type === 'text/plain' ? 1.0 : 0.8,
        processingTimeMs: processingTimeMs
      });
      
    } catch (processingError) {
      console.error('Processing error:', processingError);
      throw processingError;
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Dosya işlenirken hata oluştu' },
      { status: 500 }
    );
  }
}
