import { DetectedPersonalData, PersonalDataType } from '../models';
import { REGEX_PATTERNS, validateTCKimlik, validateIBAN } from './regex-patterns';

export interface DetectionResult {
  detectedData: DetectedPersonalData[];
  maskedText: string;
  processingTimeMs: number;
}

export class DetectionEngine {
  // Regex tabanlı tespit
  private detectWithRegex(text: string): DetectedPersonalData[] {
    const detected: DetectedPersonalData[] = [];
    
    for (const pattern of REGEX_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);
      
      while ((match = regex.exec(text)) !== null) {
        const originalValue = match[0];
        let confidence = 0.8; // Varsayılan güven skoru
        
        // Özel doğrulama kontrolleri
        if (pattern.type === PersonalDataType.TC_KIMLIK) {
          if (!validateTCKimlik(originalValue.replace(/\s/g, ''))) {
            continue; // Geçersiz TC, atla
          }
          confidence = 0.95;
        }
        
        if (pattern.type === PersonalDataType.IBAN) {
          if (!validateIBAN(originalValue)) {
            continue; // Geçersiz IBAN, atla
          }
          confidence = 0.95;
        }
        
        detected.push({
          type: pattern.type,
          originalValue,
          maskedValue: pattern.maskingRule(originalValue),
          position: {
            start: match.index,
            end: match.index + originalValue.length
          },
          confidence
        });
      }
    }
    
    return detected;
  }
  
  // NLP/NER tabanlı tespit (OpenRouter API kullanarak)
  private async detectWithNLP(text: string): Promise<DetectedPersonalData[]> {
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('OpenRouter API key not found, skipping NLP detection');
      return [];
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'KVGuard - Personal Data Detection'
        },
        body: JSON.stringify({
          model: 'x-ai/grok-4-fast:free',
          messages: [
            {
              role: 'system',
              content: `Sen bir kişisel veri tespit uzmanısın. Verilen metinde Türkçe kişisel verileri tespit et ve JSON formatında döndür.
              
              Tespit edilecek veri türleri:
              - ISIM: Kişi adları ve soyadları
              - ADRES: Ev/iş adresleri, mahalle, sokak, şehir bilgileri
              - SAGLIK_VERISI: Hastalık, ilaç, tedavi, sağlık durumu bilgileri
              
              Çıktı formatı:
              {
                "detected": [
                  {
                    "type": "ISIM|ADRES|SAGLIK_VERISI",
                    "value": "tespit edilen değer",
                    "start": başlangıç_pozisyonu,
                    "end": bitiş_pozisyonu,
                    "confidence": 0.0-1.0_arası_güven_skoru
                  }
                ]
              }`
            },
            {
              role: 'user',
              content: `Bu metindeki kişisel verileri tespit et:\n\n${text}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
      
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) return [];
      
      // JSON çıktısını parse et
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return [];
      
      const result = JSON.parse(jsonMatch[0]);
      
      return result.detected.map((item: any) => ({
        type: PersonalDataType[item.type as keyof typeof PersonalDataType],
        originalValue: item.value,
        maskedValue: this.maskValue(item.value, item.type),
        position: {
          start: item.start,
          end: item.end
        },
        confidence: item.confidence
      }));
      
    } catch (error) {
      console.error('NLP detection error:', error);
      return [];
    }
  }
  
  // Değeri maskeleme
  private maskValue(value: string, type: string): string {
    switch (type) {
      case 'ISIM':
        const words = value.split(' ');
        return words.map(word => 
          word.length > 2 ? `${word[0]}${'*'.repeat(word.length - 1)}` : word
        ).join(' ');
        
      case 'ADRES':
        return value.replace(/\d+/g, '***').replace(/[A-Za-zÇĞıİÖŞÜçğıiöşü]{3,}/g, 
          match => `${match.slice(0, 2)}${'*'.repeat(Math.max(1, match.length - 2))}`);
        
      case 'SAGLIK_VERISI':
        return '*'.repeat(Math.min(value.length, 10));
        
      default:
        return '*'.repeat(value.length);
    }
  }
  
  // Ana tespit fonksiyonu
  async detect(text: string): Promise<DetectionResult> {
    const startTime = Date.now();
    
    // Regex ve NLP tespitlerini paralel çalıştır
    const [regexResults, nlpResults] = await Promise.all([
      this.detectWithRegex(text),
      this.detectWithNLP(text)
    ]);
    
    // Sonuçları birleştir ve çakışmaları çöz
    const allDetected = [...regexResults, ...nlpResults];
    const mergedResults = this.mergeOverlappingDetections(allDetected);
    
    // Maskelenmiş metni oluştur
    const maskedText = this.applyMasking(text, mergedResults);
    
    const processingTimeMs = Date.now() - startTime;
    
    return {
      detectedData: mergedResults,
      maskedText,
      processingTimeMs
    };
  }
  
  // Çakışan tespitleri birleştir
  private mergeOverlappingDetections(detected: DetectedPersonalData[]): DetectedPersonalData[] {
    // Pozisyona göre sırala
    const sorted = detected.sort((a, b) => a.position.start - b.position.start);
    const merged: DetectedPersonalData[] = [];
    
    for (const current of sorted) {
      const lastMerged = merged[merged.length - 1];
      
      if (lastMerged && this.isOverlapping(lastMerged.position, current.position)) {
        // Daha yüksek güven skoruna sahip olanı tercih et
        if (current.confidence > lastMerged.confidence) {
          merged[merged.length - 1] = current;
        }
      } else {
        merged.push(current);
      }
    }
    
    return merged;
  }
  
  // İki pozisyonun çakışıp çakışmadığını kontrol et
  private isOverlapping(pos1: { start: number; end: number }, pos2: { start: number; end: number }): boolean {
    return pos1.start < pos2.end && pos2.start < pos1.end;
  }
  
  // Maskelemeyi uygula
  private applyMasking(text: string, detected: DetectedPersonalData[]): string {
    let maskedText = text;
    
    // Sondan başlayarak maskeleme uygula (indeks kayması olmasın)
    const sortedByPosition = detected.sort((a, b) => b.position.start - a.position.start);
    
    for (const item of sortedByPosition) {
      maskedText = maskedText.slice(0, item.position.start) + 
                  item.maskedValue + 
                  maskedText.slice(item.position.end);
    }
    
    return maskedText;
  }
}
