-- Drama Makine Sevkiyat — Supabase SQL Şeması
-- Supabase Dashboard → SQL Editor'a yapıştırın

-- Firmalar
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teslimat Rotaları
CREATE TABLE IF NOT EXISTS delivery_routes (
  id TEXT PRIMARY KEY,
  driver_id TEXT NOT NULL,
  driver_name TEXT,
  plate TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active', -- active | completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teslimat Durağı
CREATE TABLE IF NOT EXISTS delivery_stops (
  id TEXT PRIMARY KEY,
  route_id TEXT REFERENCES delivery_routes(id) ON DELETE CASCADE,
  company_id TEXT,
  company_name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  stop_order INTEGER,
  status TEXT DEFAULT 'pending', -- pending | active | done
  track_token TEXT UNIQUE,
  started_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Araç Konumları
CREATE TABLE IF NOT EXISTS vehicle_locations (
  id BIGSERIAL PRIMARY KEY,
  stop_id TEXT REFERENCES delivery_stops(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  accuracy REAL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed firmalar
INSERT INTO companies (id, name, address, lat, lng) VALUES
('c1',  'NSK OTOMOTİV SANAYİ VE TİCARET A.Ş.',            'Nilüfer OSB, Bursa',        40.2186, 28.9342),
('c2',  'ŞAHİNCE OTOMOTİV SANAYİ VE TİC. A.Ş.',           'Yıldırım, Bursa',            40.1896, 29.1021),
('c3',  'CANEL OTOMOTİV SAN. VE TİC. A.Ş.',                'Osmangazi, Bursa',           40.1826, 29.0614),
('c4',  'EJS ESKİŞEHİR JANT VE MAKİNA SAN. TİC. A.Ş.',    'Eskişehir OSB, Eskişehir',   39.7767, 30.5206),
('c5',  'DERİN HAVACILIK SANAYİ TİCARET A.Ş.',             'Gemlik, Bursa',              40.4323, 29.1537),
('c6',  'TEKNOFORM MAKİNA İNŞ. SAN. TİC. LTD. ŞTİ.',      'Mustafakemalpaşa, Bursa',    40.0398, 28.4072),
('c7',  'DEHA OTOMAT MAK. SAN. VE TİC. LTD. ŞTİ.',        'Kestel, Bursa',              40.1741, 29.2156),
('c8',  'DURMAZLAR MAKİNA SAN. VE TİC. A.Ş.',              'Nilüfer, Bursa',             40.2344, 28.9821),
('c9',  'FENESE KALIP PLASTİK METAL SAN. TİC. LTD. ŞTİ.', 'Gürsu, Bursa',              40.2012, 29.1834),
('c10', 'DOĞU PRES OTOMOTİV VE TEKNİK SAN. VE TİC. A.Ş.','Osmangazi, Bursa',           40.1953, 29.0734),
('c11', 'HÜNEL KALIP SAN. VE TİC. LTD. ŞTİ.',             'Yıldırım, Bursa',            40.1812, 29.1243),
('c12', 'SYC DEMİR DÖKÜM VE MAKİNA SAN. TİC. A.Ş.',       'İnegöl, Bursa',             40.0712, 29.5134),
('c13', 'YEMTAR MAKİNA SAN. TİC. A.Ş.',                    'Nilüfer OSB, Bursa',         40.2267, 28.9512)
ON CONFLICT DO NOTHING;

-- Realtime abone ol (opsiyonel)
-- ALTER TABLE vehicle_locations REPLICA IDENTITY FULL;
-- ALTER TABLE delivery_stops REPLICA IDENTITY FULL;

-- RLS (Row Level Security) — production için aktif edin
-- ALTER TABLE delivery_routes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE delivery_stops ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vehicle_locations ENABLE ROW LEVEL SECURITY;
