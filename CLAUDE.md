# GSYF Pusulası — proje notu

Bu klasör, Türkiye'deki Girişim Sermayesi Yatırım Fonlarını (GSYF) keşfetmeye yarayan
tek dosyalık bir web sitesi prototipidir. Sahibi: Haldun (Wite). Deneme amaçlı kişisel proje;
gsyfatlas.com'dan ilham alınmış ama onunla bağlantısı yok — o markanın adı/logosu kullanılmaz.

## Dosyalar
- `index.html` — sitenin tamamı (HTML + CSS + JS tek dosyada). Sunucu, build veya paket gerekmez.
- `CLAUDE.md` — bu not.

## Sitenin yapısı
Tek dosya içinde hash tabanlı çok sayfalı yapı. Her `<main data-view="...">` bir sayfadır;
`route()` fonksiyonu `location.hash`'e göre görünür olanı seçer.
- `#home`   — Ana sayfa: hero, 4 istatistik, akan fon şeridi (ticker), 6 özellik kartı, kapanış CTA
- `#bulucu` — Fon Bulucu: form üstte, sonuç kartları altta (ağırlıklı puanlama: sektör %40, bütçe %25, risk %20, dışa açıklık %15)
- `#fonlar` — Fon listesi: arama + durum filtresi + 3 sütunlu kartlar
- `#rehber` — %3 zorunlu yatırım yükümlülüğü rehberi + hesaplayıcı (vergi avantajı × %3; eşik 2 milyon TL)
- `#sss`    — Sık sorulan sorular

Veri kaynakları JS içinde:
- `REAL_FUNDS` — SPK kayıtlı 10 gerçek fon (ad, kod, yönetici). Ticker VE fon kartları bu tek listeden beslenir. Fon eklemek için sadece bu diziye satır ekle.
- `FUNDS` — Fon Bulucu için 8 adet **demo** fon. Gerçek veri değildir; adları "Demo ..." ile başlar, sayfada demo olduğu yazar. Gerçek fonlara uydurma getiri/büyüklük verisi ekleme.

## Tasarım kararları (değiştirmeden önce sor)
- Font: IBM Plex Sans (Google Fonts). Başlıklar kalın lacivert, vurgu kelime mavi (`.accent`).
- Renkler: beyaz zemin (#FFFFFF), lacivert #0F1E3D, mavi #2563EB, gradyan butonlar (lacivert→mavi).
- Karanlık mod bilinçli olarak KAPALI (`color-scheme:light`); kullanıcı her cihazda beyaz istiyor.
- Yazılar küçük ve ferah: h1 en fazla 2.6rem, gövde 1rem / satır 1.7. Metinleri sıkıştırma.
- Ticker sade metin: kutu yok, mavi arka planlı kod rozeti yok; kod düz mavi yazı, "Aktif" yeşil noktalı.
- Fon kartları: büyük harf fon adı, sağ üstte yeşil "Aktif", kod, bina ikonlu yönetici, altta GSYF / SPK kayıtlı / KAP linki.

## Hukuki / içerik kuralları
- Sayfa yatırım tavsiyesi vermez; bu uyarılar footer ve hesaplayıcıda durur, silinmez.
- %3 kuralı ve rakamlar (477 fon, 422,6 milyar ₺, 17.900 nitelikli yatırımcı, 700 milyar ₺ 2026 hedefi) 2025 sonu sektör verisidir, kaynak Ekonomist linki hero'da var. Rakam güncellerken kaynağı da güncelle.
- Gerçek fon adlarına uydurma performans verisi eklenmez.

## Yayınlama
GitHub hesabı: **Mhaldunn**. Depo: `github.com/Mhaldunn/gsyf-pusulasi` (public, branch `main`, klasör `/`).
Site adresi: `https://mhaldunn.github.io/gsyf-pusulasi/`. Hash yönlendirmesi statik hostta sorunsuz çalışır.
Sonraki adımlar sırayla: (1) GitHub'a it ve Pages'i aç, (2) fon listesini 477 fona genişlet
(önce JSON dosyası, sonra KAP entegrasyonu), (3) iletişim formu (Formspree/Netlify Forms),
(4) Google Search Console + KVKK metni.

## Çalışma sırası
Adım adım plan `PLAN.md` dosyasında (FAZ 0-3). Sıra: sayfayı tamamla → gerçek veriyi bağla → GitHub'a al.
FAZ 3 bitmeden alan adı, form, analitik ekleme. Her fazın sonunda tarayıcıda kontrol ettir.

## Çalışma tarzı
Haldun Türkçe yazar, kısa ve net cevap ister; değişiklikleri önce açıklamadan uygulamak yerine
tek cümleyle ne yapacağını söyle, sonra yap. Görsel değişikliklerde ekran görüntüsüyle kontrol et.
