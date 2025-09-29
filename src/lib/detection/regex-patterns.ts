import { PersonalDataType } from '../models';

// Regex desenleri ve maskeleme kuralları
export interface PatternConfig {
  type: PersonalDataType;
  pattern: RegExp;
  maskingRule: (value: string) => string;
  description: string;
}

export const REGEX_PATTERNS: PatternConfig[] = [
  // TC Kimlik Numarası (11 haneli)
  {
    type: PersonalDataType.TC_KIMLIK,
    pattern: /\b[1-9]\d{10}\b/g,
    maskingRule: (value: string) => `${value.slice(0, 3)}****${value.slice(-3)}`,
    description: 'TC Kimlik Numarası'
  },
  
  // IBAN (TR ile başlayan 26 karakter)
  {
    type: PersonalDataType.IBAN,
    pattern: /\bTR\d{24}\b/gi,
    maskingRule: (value: string) => `${value.slice(0, 8)}****${value.slice(-4)}`,
    description: 'IBAN Numarası'
  },
  
  // Telefon numarası (çeşitli formatlar)
  {
    type: PersonalDataType.TELEFON,
    pattern: /(\+90|0)?\s?(\(\d{3}\)|\d{3})\s?\d{3}\s?\d{2}\s?\d{2}/g,
    maskingRule: (value: string) => {
      const cleaned = value.replace(/\D/g, '');
      return `${cleaned.slice(0, 3)}****${cleaned.slice(-2)}`;
    },
    description: 'Telefon Numarası'
  },
  
  // Kredi kartı numarası (16 haneli)
  {
    type: PersonalDataType.KREDI_KARTI,
    pattern: /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g,
    maskingRule: (value: string) => {
      const cleaned = value.replace(/\s/g, '');
      return `${cleaned.slice(0, 4)} **** **** ${cleaned.slice(-4)}`;
    },
    description: 'Kredi Kartı Numarası'
  },
  
  // Email adresi
  {
    type: PersonalDataType.EMAIL,
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    maskingRule: (value: string) => {
      const [local, domain] = value.split('@');
      const maskedLocal = local.length > 2 
        ? `${local.slice(0, 2)}****${local.slice(-1)}`
        : '****';
      return `${maskedLocal}@${domain}`;
    },
    description: 'E-posta Adresi'
  },
  
  // Doğum tarihi (DD.MM.YYYY, DD/MM/YYYY formatları)
  {
    type: PersonalDataType.DOGUM_TARIHI,
    pattern: /\b(0[1-9]|[12]\d|3[01])[.\/-](0[1-9]|1[0-2])[.\/-](19|20)\d{2}\b/g,
    maskingRule: (value: string) => '**.**.****.', 
    description: 'Doğum Tarihi'
  }
];

// TC Kimlik numarası doğrulama algoritması
export function validateTCKimlik(tc: string): boolean {
  if (tc.length !== 11 || tc[0] === '0') return false;
  
  const digits = tc.split('').map(Number);
  const checkSum1 = ((digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7 - 
                     (digits[1] + digits[3] + digits[5] + digits[7])) % 10;
  const checkSum2 = (digits[0] + digits[1] + digits[2] + digits[3] + digits[4] + 
                     digits[5] + digits[6] + digits[7] + digits[8] + digits[9]) % 10;
  
  return checkSum1 === digits[9] && checkSum2 === digits[10];
}

// IBAN doğrulama
export function validateIBAN(iban: string): boolean {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  if (cleanIban.length !== 26 || !cleanIban.startsWith('TR')) return false;
  
  // IBAN mod-97 algoritması
  const rearranged = cleanIban.slice(4) + cleanIban.slice(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, char => 
    (char.charCodeAt(0) - 55).toString()
  );
  
  // Büyük sayılar için mod97 hesaplama
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  return remainder === 1;
}
