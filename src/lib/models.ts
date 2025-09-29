import { ObjectId } from 'mongodb';

// Tespit edilen kişisel veri türleri
export enum PersonalDataType {
  TC_KIMLIK = 'TC_KIMLIK',
  IBAN = 'IBAN',
  TELEFON = 'TELEFON',
  KREDI_KARTI = 'KREDI_KARTI',
  ADRES = 'ADRES',
  ISIM = 'ISIM',
  SAGLIK_VERISI = 'SAGLIK_VERISI',
  EMAIL = 'EMAIL',
  DOGUM_TARIHI = 'DOGUM_TARIHI'
}

// Tespit edilen kişisel veri
export interface DetectedPersonalData {
  type: PersonalDataType;
  originalValue: string;
  maskedValue: string;
  position: {
    start: number;
    end: number;
  };
  confidence: number; // 0-1 arası güven skoru
}

// Dosya işleme kaydı
export interface ProcessedFile {
  _id?: ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  processedDate: Date;
  originalText: string;
  maskedText: string;
  detectedData: DetectedPersonalData[];
  userId?: string; // Kullanıcı kimliği (opsiyonel)
  status: 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

// Denetim logu
export interface AuditLog {
  _id?: ObjectId;
  fileId: ObjectId;
  fileName: string;
  dataType: PersonalDataType;
  originalValue: string;
  maskedValue: string;
  detectionMethod: 'regex' | 'nlp' | 'hybrid';
  confidence: number;
  userId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// İstatistik verisi
export interface Statistics {
  _id?: ObjectId;
  date: Date;
  totalFilesProcessed: number;
  totalDataDetected: number;
  dataTypeBreakdown: {
    [key in PersonalDataType]: number;
  };
  averageConfidence: number;
  processingTimeMs: number;
}
