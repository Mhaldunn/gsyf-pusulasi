# GSYF Pusulası

Türkiye'deki Girişim Sermayesi Yatırım Fonlarını (GSYF) keşfetmeye yarayan, tek dosyalık (HTML + CSS + JS) bir web sitesi. Sahibi: Haldun (Wite). Deneme amaçlı kişisel bir proje; gsyfatlas.com'dan ilham alınmış ama onunla herhangi bir bağlantısı yoktur.

**Canlı adres:** https://mhaldunn.github.io/gsyf-pusulasi/

## Sitede neler var?

- **Ana Sayfa** — hero, hero istatistikleri, akan fon şeridi, %3 zorunlu yatırım hesaplayıcı, özellik kartları
- **Fon Bulucu** — sektör/bütçe/risk/dışa açıklık tercihine göre ağırlıklı puanlama ile örnek (demo) fon eşleştirme
- **Fonlar** — SPK'ya kayıtlı girişim sermayesi yatırım fonlarının tam listesi; arama, durum ve yönetici şirket filtresi; her fonun kendi detay sayfası (`#fon-<slug>`)
- **%3 Rehberi** — Ar-Ge/teknokent kazanç istisnası kapsamındaki zorunlu yatırım yükümlülüğü rehberi ve hesaplayıcısı
- **Hakkımızda / İletişim / Yasal** — platform, iletişim ve yasal bilgilendirme sayfaları
- **SSS** — sık sorulan sorular

## Klasör yapısı

```
.
├── index.html              Sitenin tamamı (HTML + CSS + JS, tek dosya)
├── data/
│   ├── funds.json          SPK'dan çekilen gerçek GSYF listesi
│   └── stats.json          Ana sayfadaki hero istatistikleri (kaynak: Ekonomist)
├── scripts/
│   └── fetch_funds.js      data/funds.json'u SPK'nın resmi sayfasından üreten/güncelleyen betik
├── package.json
├── CLAUDE.md                Proje notu / çalışma kuralları
└── PLAN.md                  Aşamalı geliştirme planı
```

## Fon verisini güncelleme

Fon listesi, SPK'nın ihraç belgesi onaylanan GSYF sayfasından çekilir. Güncellemek için:

```
npm run fetch-funds
```

Bu komut `data/funds.json`'u yeniden üretir; mevcut fonların elle girilmiş `detail` bilgileri (varsa) isme göre korunur, yeni fonlara boş (null alanlı) bir detay eklenir. Fon kodu ve onay tarihi SPK kaynağında yer almadığı için `null` bırakılır, uydurulmaz.

## Yerelde çalıştırma

Statik dosyalar `fetch('data/...')` kullandığı için `file://` ile açmak yeterli değildir; bir HTTP sunucusu gerekir:

```
npx http-server .
```

veya elinizde Python varsa:

```
python -m http.server 8000
```

## Yasal not

GSYF Pusulası bağımsız bir bilgi platformudur; SPK lisanslı bir kuruluş değildir, yatırım danışmanlığı veya aracılık hizmeti sunmaz. Sitede yer alan bilgiler kamuya açık kaynaklardan derlenmiştir ve **yatırım tavsiyesi niteliği taşımaz**.
