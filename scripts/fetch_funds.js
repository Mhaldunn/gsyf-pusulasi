#!/usr/bin/env node
// SPK'nin ihraç belgesi onaylanan GSYF listesini çekip data/funds.json'u üretir/günceller.
//
// Kullanım:
//   npm run fetch-funds
//   (veya doğrudan: node scripts/fetch_funds.js)
//
// Bağımlılık yok (yalnızca Node'un yerleşik modülleri kullanılır).
//
// Yeniden çalıştırılabilir: mevcut data/funds.json'daki fonların "detail"
// nesneleri isme göre eşleştirilip korunur; yeni fonlara boş (null alanlı)
// bir detail eklenir. Fon kodu ve onay tarihi SPK tablosunda yer almadığı
// için null bırakılır, uydurulmaz.

const fs = require('fs');
const path = require('path');
const https = require('https');

const SOURCE_URL = 'https://spk.gov.tr/kurumlar/fonlar/yatirim-fonlari/girisim-sermayesi-yatirim-fonlari/ihrac-belgesi-onaylanan-girisim-sermayesi-yatirim-fonlari';
const ROOT = path.join(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'data', 'funds.json');

const TR_MAP = { 'Ğ':'g','ğ':'g','Ü':'u','ü':'u','Ş':'s','ş':'s','İ':'i','ı':'i','Ö':'o','ö':'o','Ç':'c','ç':'c' };

function emptyDetail(){
  return {
    totalValue: null,
    totalValueDate: null,
    foreignOpenness: null,
    minInvestment: null,
    entryDate: null,
    fundType: null,
    fundClass: null,
    isin: null,
    establishmentDate: null,
    fundDuration: null,
    liquidationDate: null,
    managementFee: null,
    founder: null,
    independentAudit: null,
    custodian: null,
    investmentStrategy: null,
    contact: { address: null, phone: null, email: null, person: null },
    sectors: [],
  };
}

function normalizeText(s){
  s = s.replace(/\s+/g, ' ').trim();
  // "A.Ş." son ekini tutarlı biçime getirir (AŞ / A.S / A Ş -> A.Ş.); adın
  // kendisini (kelime sırasını, içeriğini) değiştirmez.
  s = s.replace(/\s+A\.?\s?Ş\.?\s*$/i, ' A.Ş.');
  return s;
}

function slugify(s){
  return s.split('').map(ch => TR_MAP[ch] || ch).join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fundSlug(name){
  let base = name.replace(/girişim sermayesi yatırım fonu$/i, '').trim();
  if (!base) base = name;
  return slugify(base);
}

function uniqueSlug(base, used){
  if (!used.has(base)) { used.add(base); return base; }
  let n = 2;
  while (used.has(`${base}-${n}`)) n++;
  const slug = `${base}-${n}`;
  used.add(slug);
  return slug;
}

function decodeEntities(s){
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
}

function fetchHtml(url){
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    }).on('error', reject);
  });
}

function parseRows(html){
  const tableMatch = html.match(/<table[\s\S]*?<\/table>/);
  if (!tableMatch) throw new Error('SPK sayfasında tablo bulunamadı; sayfa yapısı değişmiş olabilir.');
  const tableHtml = tableMatch[0];

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
  const rows = [];
  let rm;
  while ((rm = rowRegex.exec(tableHtml)) !== null) {
    const rowHtml = rm[1];
    const cells = [];
    let cm;
    cellRegex.lastIndex = 0;
    while ((cm = cellRegex.exec(rowHtml)) !== null) {
      cells.push(decodeEntities(cm[1].replace(/<[^>]+>/g, '')).trim());
    }
    if (cells.length >= 3) {
      const manager = normalizeText(cells[1]);
      const name = normalizeText(cells[2]);
      if (name && manager) rows.push([name, manager]);
    }
  }
  return rows;
}

function findUpdateHint(html){
  const m = html.match(/<!--\s*div[^>]*class="tarih"[^>]*>([^<]+)<\/div\s*-->/);
  return m ? m[1].trim() : null;
}

function loadExistingDetails(outputPath){
  if (!fs.existsSync(outputPath)) return {};
  try {
    const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    const details = {};
    (existing.funds || []).forEach(f => {
      if (f.name && f.detail) details[f.name] = f.detail;
    });
    return details;
  } catch (e) {
    return {};
  }
}

async function main(){
  const html = await fetchHtml(SOURCE_URL);
  const rows = parseRows(html);
  if (!rows.length) throw new Error('Tablo bulundu ama hiç satır ayrıştırılamadı.');

  const existingDetails = loadExistingDetails(OUTPUT_PATH);
  const updateHint = findUpdateHint(html);
  const fetchedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const usedSlugs = new Set();
  const funds = rows.map(([name, manager]) => {
    const slug = uniqueSlug(fundSlug(name), usedSlugs);
    return {
      name,
      slug,
      code: null,
      manager,
      status: 'Aktif',
      approvalDate: null,
      source: SOURCE_URL,
      fetchedAt,
      detail: existingDetails[name] || emptyDetail(),
    };
  });

  const output = {
    source: SOURCE_URL,
    fetchedAt,
    listUpdatedHint: updateHint,
    listUpdatedHintNote: updateHint
      ? "Kaynak sayfanın HTML'inde gizli (yorum satırı) olarak bulundu; SPK tarafından ayrıca teyit edilmemiştir."
      : null,
    note: 'Fon kodu ve onay tarihi SPK tablosunda yer almadığı için null bırakıldı, uydurulmadı.',
    funds,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');

  const managers = new Set(funds.map(f => f.manager));
  console.log(`${funds.length} fon yazıldı (${managers.size} farklı portföy yönetim şirketi).`);
  console.log(`Çıktı: ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Hata:', err.message);
  process.exit(1);
});
