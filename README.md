# Drama Makine — Sevkiyat Takip Sistemi

## Özellikler

- 🚚 Canlı GPS araç takibi (Leaflet + OpenStreetMap)
- 📍 OSRM ile trafik bazlı ETA hesaplama
- 📧 Otomatik HTML mail bildirimi (barkin.kayaci@dramamakine.com)
- 🔗 Herkese açık takip linki (giriş gerektirmez)
- 📱 PWA — telefona ana ekrana eklenebilir
- 🔒 Şoför / Admin ayrımı
- 📊 Tarih bazlı istatistikler + CSV export
- ⭐ Firma favorileme ve hızlı arama
- 🗺️ Mini harita + Google/Apple navigasyon entegrasyonu

---

## Hızlı Başlangıç (Yerel — Supabase'siz)

Sistem şu an **localStorage** ile çalışır, Supabase olmadan da tam işlevseldir.

```bash
# Herhangi bir statik sunucu ile açın:
npx serve .
# veya
python3 -m http.server 8080
```

Tarayıcıda `http://localhost:8080` açın.

### Demo Hesapları

| Kullanıcı | Şifre     | Rol    | Araç        |
|-----------|-----------|--------|-------------|
| sofor1    | 1234      | Şoför  | 16 ASE 156  |
| sofor2    | 1234      | Şoför  | 16 AHN 572  |
| admin     | drama2024 | Admin  | Tümü        |

---

## Sayfalar

| Sayfa                    | URL                        | Erişim         |
|--------------------------|----------------------------|----------------|
| Giriş                    | /index.html                | Herkese         |
| Panel (ana ekran)        | /pages/panel.html          | Şoför + Admin  |
| Günlük Plan              | /pages/plan.html           | Şoför + Admin  |
| Firmalar                 | /pages/companies.html      | Şoför + Admin  |
| Canlı Takip              | /pages/tracking.html?token=XXX | Herkese   |
| İstatistikler            | /pages/stats.html          | Sadece Admin   |

---

## Supabase Kurulumu (İsteğe Bağlı — Gerçek Zamanlı Çoklu Cihaz)

1. [supabase.com](https://supabase.com) → New Project oluşturun
2. **SQL Editor** → `supabase_schema.sql` içeriğini yapıştırın → Run
3. **Settings → API** → `URL` ve `anon key` alın
4. `js/config.js` dosyasını açın:

```js
const SUPABASE_URL = 'https://XXXXX.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';
```

5. Supabase JS kütüphanesini `index.html` `<head>` içine ekleyin:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

## Mail Entegrasyonu (Resend veya SMTP)

Mail gönderimi şu an simüle edilir (localStorage'a kaydedilir).  
Gerçek mail için **Supabase Edge Function** + **Resend** kullanın:

1. [resend.com](https://resend.com) → API key alın
2. Supabase Dashboard → Edge Functions → `send-mail` oluşturun
3. `js/config.js` → `sendNotificationMail()` fonksiyonunu güncelleyin:

```js
async function sendNotificationMail(stop, plate, driverName, eta) {
  const res = await fetch('https://XXXXX.supabase.co/functions/v1/send-mail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_ANON_KEY },
    body: JSON.stringify({
      to: 'barkin.kayaci@dramamakine.com',
      subject: stop.companyName + ' — Siparişiniz Yola Çıktı',
      html: buildMailHTML(stop, plate, driverName, eta)
    })
  });
  return res.ok;
}
```

---

## Android / iOS Kurulumu (PWA olarak)

### Android
1. Chrome ile siteyi açın
2. Menü → **"Ana Ekrana Ekle"**
3. Uygulama gibi açılır, GPS arka planda çalışır

### iOS (Safari)
1. Safari ile açın
2. Paylaş → **"Ana Ekrana Ekle"**
3. iOS 16.4+ → Arka plan bildirim desteği mevcuttur

### Capacitor (Native APK/IPA — İleri Seviye)
```bash
npm install @capacitor/core @capacitor/android @capacitor/ios
npx cap init "Drama Sevkiyat" "com.dramamakine.sevkiyat"
npx cap add android
npx cap add ios
npx cap copy
npx cap open android   # Android Studio
npx cap open ios       # Xcode
```

`capacitor.config.json` için gerekli izinler (otomatik eklenir):
- `ACCESS_FINE_LOCATION`
- `FOREGROUND_SERVICE`
- `NSLocationAlwaysAndWhenInUseUsageDescription`

---

## Dosya Yapısı

```
sevkiyat/
├── index.html              # Giriş sayfası
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (offline)
├── supabase_schema.sql     # Veritabanı şeması
├── css/
│   └── main.css            # Tüm stiller
├── js/
│   ├── config.js           # Ayarlar, DB, yardımcı fonksiyonlar
│   ├── auth.js             # Giriş/çıkış
│   └── gps.js              # GPS yöneticisi
└── pages/
    ├── panel.html          # Ana şoför paneli
    ├── plan.html           # Günlük plan oluşturma
    ├── companies.html      # Firma listesi
    ├── tracking.html       # Canlı takip (herkese açık)
    └── stats.html          # İstatistikler (admin)
```

---

## Güvenlik Notları

- Token süresi: teslimat tamamlandığında link otomatik pasif olur
- Admin sayfaları `requireAuth('admin')` ile korunur
- Production'da Supabase RLS kurallarını aktif edin
- KVKK uyumu için konum verileri sadece aktif teslimat sırasında toplanır

---

## Destek & Geliştirme

İleride eklenebilecekler (altyapı hazır):
- Firebase Push Notification
- WhatsApp API bildirimi
- SMS API (Netgsm/Twilio)
- Supabase Realtime WebSocket
- PDF rapor export
- QR kod ile teslimat onayı
- Fotoğraflı dijital imza
