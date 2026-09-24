# GSYF Pusulası — Onaya hazırlık planı

Hedef: Sayfayı eksiksiz, gerçek verili ve hukuken temiz hale getirip `github.com/Mhaldunn/gsyf-pusulasi`
deposuna almak. Onay geldikten sonra alan adı ve gelişmiş özellikler (KAP canlı entegrasyonu, form, analitik) eklenecek.

Her adımın altında terminaldeki Claude'a **olduğu gibi yapıştırılacak** komut var. Adımları sırayla yap,
her adımın sonunda tarayıcıda `index.html`'i açıp kontrol et.

---

## FAZ 0 — Başlangıç kontrolü (2 dk)

```
CLAUDE.md ve PLAN.md dosyalarını oku. Projeyi 3 cümleyle özetle, sonra PLAN.md'deki FAZ 1'e geçmeden önce
index.html'i tarayıcıda açıp 5 sayfanın (#home #bulucu #fonlar #rehber #sss) çalıştığını doğrula.
Değişiklik yapma, sadece rapor ver.
```

---

## FAZ 1 — Sayfayı tamamla (eksik bölümler)

Onaya giden bir sitede şunlar olmalı; şu an yok:

**1.1 Hakkımızda sayfası (`#hakkimizda`)**
```
index.html'e mevcut yapıyla uyumlu yeni bir sayfa ekle: #hakkimizda. Üst menüye ve footer'a bağlantısını koy.
İçerik: GSYF Pusulası nedir (bağımsız bilgi platformu), kime hizmet eder (zorunlu yatırımcı Ar-Ge/teknokent
şirketleri, gönüllü nitelikli yatırımcılar), ne yapmaz (yatırım tavsiyesi vermez, fon satmaz, aracılık yapmaz).
Kısa, 3 paragraf. Aynı font, renk ve kart stilini kullan; yeni CSS sınıfı üretme, mevcutları kullan.
```

**1.2 İletişim sayfası (`#iletisim`)**
```
#iletisim sayfası ekle. Şimdilik form YOK (statik sitede gönderilemez); yerine e-posta adresi için
[E-POSTA EKLENECEK] yer tutucusu, "Hafta içi 09:00-18:00 yanıt" notu ve KAP/SPK bağlantıları.
Menüye ve footer'a ekle. Yer tutucuyu göze batan sarı bir etiketle işaretle ki onaydan önce dolduralım.
```

**1.3 Hukuki metinler (`#yasal`)**
```
#yasal adında tek sayfa ekle, içinde 3 başlık: (a) Yasal Uyarı — yatırım tavsiyesi değildir, SPK lisanslı
kuruluş değildir, bilgiler kamuya açık kaynaklardan derlenmiştir, doğruluk garantisi yoktur;
(b) KVKK Aydınlatma Metni — şu an kişisel veri toplanmadığını, form eklenince güncelleneceğini yazan kısa taslak;
(c) Çerez Politikası — yalnızca zorunlu çerez/localStorage kullanılmadığını belirt.
Footer'a "Yasal Uyarı · KVKK · Çerezler" bağlantıları ekle. Metinlerin başına "TASLAK — hukuk kontrolü bekliyor" etiketi koy.
```

**1.4 Demo verinin temizliği**
```
Fon Bulucu'daki 8 demo fonu kaldırma ama şunu yap: sayfanın en üstüne açık mavi bir bilgi kutusu ekle:
"Fon Bulucu şu an örnek veri setiyle çalışır; gerçek fon özellikleri FAZ 2'de bağlanacaktır."
Sonuç kartlarındaki "Örnek büyüklük" satırını kaldır (uydurma rakam görünmesin).
```

**1.5 Mobil kontrol**
```
Tarayıcıyı 390px genişliğe getirip 7 sayfayı da kontrol et. Yatay kayma, taşan metin, üst üste binen buton
varsa düzelt. Üst menüyü mobilde hamburger yapmadan, satır kaydırarak sığdır. Ekran görüntüsü alıp göster.
```

---

## FAZ 2 — Gerçek veriyi bağla

Şu an 10 örnek fon var; onay için tam liste gerekir. Veri kaynağı SPK'nın kendi listesi.

**2.1 Fon listesini SPK'dan çek**
```
Şu sayfadaki tabloyu incele:
https://spk.gov.tr/kurumlar/fonlar/yatirim-fonlari/girisim-sermayesi-yatirim-fonlari/ihrac-belgesi-onaylanan-girisim-sermayesi-yatirim-fonlari
Sayfa yapısını bana anlat: fon adı, kurucu/portföy yönetim şirketi, onay tarihi hangi sütunlarda?
Kaç kayıt var? Sayfalama var mı? Henüz kod yazma, önce yapıyı raporla.
```

**2.2 funds.json üret**
```
SPK listesini bir Python scriptiyle (scripts/fetch_funds.py) çekip data/funds.json dosyasına yaz.
Alanlar: name, code (varsa), manager, approvalDate, status ("Aktif" varsay), source ("SPK"), fetchedAt.
Fon kodu yoksa boş bırak, uydurma. Script yeniden çalıştırılabilir olsun. Kaç fon çekildiğini raporla.
```

**2.3 Siteyi JSON'dan besle**
```
index.html'de REAL_FUNDS dizisini kaldır; sayfa açılışında fetch('data/funds.json') ile listeyi yükle.
Ticker, Fonlar sayfası kartları ve "N fon gösteriliyor" sayacı bu veriden gelsin.
Fonlar sayfasına yönetici şirkete göre filtre (select) ekle. JSON yüklenemezse "Liste yüklenemedi" mesajı göster.
Hero'daki "477" sayısını JSON'daki gerçek fon sayısıyla değiştir.
Not: file:// ile açınca fetch çalışmaz; test için "python -m http.server 8000" ile aç.
```

**2.4 İstatistikleri güncelle**
```
Hero'daki 4 istatistiğin (fon sayısı, toplam büyüklük, nitelikli yatırımcı, 2026 hedefi) kaynağı ve tarihi
data/stats.json dosyasına taşınsın; sayfa oradan okusun. Kaynak notu da JSON'dan gelsin.
Böylece rakam güncellemek için HTML'e dokunmak gerekmez.
```

---

## FAZ 3 — GitHub'a al

**3.1 Depoyu oluştur ve gönder**
```
Bu klasörü git deposu yap, .gitignore ekle (scripts/__pycache__, .DS_Store). GitHub hesabım Mhaldunn.
"gsyf-pusulasi" adında public depo oluştur (gh auth login gerekirse yönlendir), tüm dosyaları
"İlk sürüm: GSYF Pusulası prototipi" mesajıyla main'e gönder.
```

**3.2 GitHub Pages**
```
GitHub Pages'i main branch, root klasörden aç. Yayın adresini ver ve tarayıcıda açıp 7 sayfanın ve
data/funds.json yüklemesinin çalıştığını doğrula.
```
Beklenen adres: `https://mhaldunn.github.io/gsyf-pusulasi/`

**3.3 README**
```
README.md yaz: ne olduğu, canlı adres, klasör yapısı, fon verisini güncelleme komutu (python scripts/fetch_funds.py),
"yatırım tavsiyesi değildir" notu. Türkçe.
```

---

## ONAY ÖNCESİ KONTROL LİSTESİ

- [ ] 7 sayfa da açılıyor, menü ve footer bağlantıları doğru
- [ ] Fon listesi SPK'dan çekilmiş, sayı hero'da doğru
- [ ] Demo veri açıkça "örnek" olarak işaretli, uydurma rakam yok
- [ ] Hakkımızda, İletişim (e-posta dolu), Yasal sayfaları var
- [ ] Mobilde yatay kayma yok
- [ ] "TASLAK" ve "[EKLENECEK]" etiketleri kalmadı
- [ ] Site GitHub Pages'te açılıyor

## ONAY SONRASI (şimdi yapılmayacak)

- Alan adı bağlama
- İletişim formu (Formspree / Netlify Forms)
- KAP duyuru entegrasyonu
- Fon Bulucu'yu gerçek fon özellikleriyle çalıştırma (fonlardan veri toplama gerekir)
- Google Search Console, analitik
