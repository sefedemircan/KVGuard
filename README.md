# KVGuard - Kişisel Veri Koruma Sistemi

KVGuard, KVKK uyumlu kişisel veri tespit ve maskeleme sistemidir. Dosyalardaki kişisel verileri otomatik olarak tespit eder, maskeler ve güvenli bir şekilde saklar.

## 🚀 Özellikler

- **Çoklu Dosya Formatı Desteği**: PDF, TXT, CSV, JPG, PNG ve daha fazlası
- **AI Destekli Tespit**: Regex + NLP hibrit yaklaşımı ile yüksek doğruluk
- **9 Farklı Veri Türü**: TC Kimlik, IBAN, Telefon, Kredi Kartı, E-posta, Adres, İsim, Sağlık Verisi, Doğum Tarihi
- **Gerçek Zamanlı OCR**: Görsel dosyalardan metin çıkarma
- **Güvenli Veritabanı**: Supabase ile RLS korumalı veri saklama
- **Denetim İzi**: Tüm işlemlerin detaylı loglanması
- **İstatistik Raporlama**: Günlük, haftalık ve aylık analiz raporları
- **KVKK Uyumlu**: Kişisel veri koruma mevzuatına uygun tasarım

## 🛠 Teknolojiler

- **Frontend**: Next.js 15, React 19, Mantine UI
- **Backend**: Next.js API Routes, TypeScript
- **Veritabanı**: Supabase (PostgreSQL + RLS)
- **OCR**: Tesseract.js (Türkçe + İngilizce)
- **AI**: OpenRouter API (Grok-4-Fast)
- **Stil**: CSS Modules, PostCSS

## 🔧 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Veritabanı Şemasını Oluşturun

Supabase dashboard'ında aşağıdaki SQL'i çalıştırın veya migration dosyalarını kullanın:

```sql
-- Tablolar ve RLS politikaları otomatik olarak oluşturulur
-- src/lib/supabase.ts dosyasındaki migration'ları kontrol edin
```

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
# veya
yarn dev
```

[http://localhost:3000](http://localhost:3000) adresinde uygulamayı görün.

## 📊 Veritabanı Yapısı

### Tablolar

- **processed_files**: İşlenen dosya kayıtları
- **audit_logs**: Denetim ve log kayıtları  
- **statistics**: Günlük istatistik verileri

### RLS Politikaları

- Kullanıcılar sadece kendi dosyalarını görebilir
- Anonim dosyalar herkese açık
- Audit loglar ilgili dosya sahiplerine görünür
- İstatistikler herkese açık

## 🔒 Güvenlik

- **Row Level Security (RLS)**: Veritabanı seviyesinde güvenlik
- **IP ve User-Agent Tracking**: Her işlem izlenir
- **Veri Maskeleme**: Orijinal veriler güvenli şekilde saklanır
- **Audit Trail**: Tüm işlemler loglanır

## 📈 API Endpoints

- `POST /api/upload` - Dosya yükleme ve işleme
- `GET /api/statistics` - İstatistik verileri
- `GET /api/export` - Sonuçları dışa aktarma

## 🎯 Kullanım

1. Ana sayfada dosyanızı sürükleyin veya seçin
2. Sistem otomatik olarak kişisel verileri tespit eder
3. Sonuçları maskelenmiş ve orijinal metin olarak görün
4. Denetim raporlarını indirin
5. İstatistikleri takip edin

## 🧪 Test Dosyaları

`public/test-documents/` klasöründe örnek test dosyaları bulunur:

- `financial-data.txt` - Mali veri örnekleri
- `medical-report.txt` - Sağlık verisi örnekleri  
- `mixed-content.txt` - Karışık veri türleri
- `test-document-1.txt` - Genel test verisi
- `test-document-2.csv` - CSV formatında test verisi

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit'leyin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push'layın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorunuz veya öneriniz için issue açabilirsiniz.
