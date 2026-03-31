const fs   = require('fs');
const path = require('path');

const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// ─── Directories ─────────────────────────────────────────────
const distDir   = path.join(__dirname, 'dist');
const diaryDir  = path.join(__dirname, 'diary');
const drawnDir  = path.join(__dirname, 'drawn');
const diaryDist = path.join(distDir, 'diary');
const drawnDist = path.join(distDir, 'drawn');

// ─── Helper: recursively copy a folder into dist ─────────────
function copyFolder(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(f => {
    const srcPath  = path.join(src, f);
    const destPath = path.join(dest, f);
    if (fs.statSync(srcPath).isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// ─── Create dist ─────────────────────────────────────────────
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

// ─── Copy all asset folders wholesale ────────────────────────
['works', 'images', 'news', 'archive'].forEach(folder => {
  const src = path.join(__dirname, folder);
  if (fs.existsSync(src)) {
    copyFolder(src, path.join(distDir, folder));
    console.log(`✓ Copied ${folder}/`);
  }
});

// ─── Helper: read image folder, copy to dist, return sorted list
function readImageFolder(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return [];
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const allFiles = fs.readdirSync(srcDir);
  allFiles.forEach(f => {
    const srcPath = path.join(srcDir, f);
    if (!fs.statSync(srcPath).isDirectory()) {
      fs.copyFileSync(srcPath, path.join(destDir, f));
    }
  });
  return allFiles
    .filter(f => imageExts.includes(path.extname(f).toLowerCase()))
	.sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); })
	.reverse();
}

// ─── Helper: caption from filename or .txt sidecar ───────────
function getCaption(filename, srcDir) {
  const base    = path.basename(filename, path.extname(filename));
  const txtFile = path.join(srcDir, base + '.txt');
  if (fs.existsSync(txtFile)) return fs.readFileSync(txtFile, 'utf8').trim();

  const parts  = base.split('-');
  const isDate = parts.length >= 3 && /^\d{4}$/.test(parts[0]);
  if (isDate) {
    const [year, month, day, ...rest] = parts;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthName = months[parseInt(month, 10) - 1] || month;
    const words = rest.join(' ');
    return words
      ? `${words}, ${parseInt(day, 10)} ${monthName} ${year}`
      : `${parseInt(day, 10)} ${monthName} ${year}`;
  }
  return base.replace(/-/g, ' ');
}

// ─── Helper: data-date attribute ─────────────────────────────
function getDateAttr(filename) {
  const base  = path.basename(filename, path.extname(filename));
  const parts = base.split('-');
  return (parts.length >= 3 && /^\d{4}$/.test(parts[0]))
    ? `data-date="${parts[0]}-${parts[1]}-${parts[2]}"`
    : '';
}

// ─── Build DIARY blocks ───────────────────────────────────────
const diaryImages = readImageFolder(diaryDir, diaryDist);

const diaryBlocks = diaryImages.map(img => {
  const caption  = getCaption(img, diaryDir);
  const dateAttr = getDateAttr(img);
  return `    <div class="mood-item" ${dateAttr}>
      <img class="mood-img" src="diary/${img}" alt="${caption}" loading="lazy">
      <div class="mood-cap">${caption}</div>
    </div>`;
}).join('\n');

const diaryHTML = diaryBlocks ||
  `    <div style="padding:3rem 2rem;font-family:'Cormorant Garamond',serif;font-style:italic;color:#8a867c;font-size:0.9rem">
      No entries yet — add images to the diary/ folder.
    </div>`;

// ─── Build DRAWN blocks ───────────────────────────────────────
const drawnImages = readImageFolder(drawnDir, drawnDist);

const drawnBlocks = drawnImages.map(img => {
  const caption  = getCaption(img, drawnDir);
  const dateAttr = getDateAttr(img);
  return `    <div class="drawn-item" ${dateAttr}>
      <img class="drawn-img" src="drawn/${img}" alt="${caption}" loading="lazy">
      <span class="drawn-lbl">${caption}</span>
    </div>`;
}).join('\n');

const drawnHTML = drawnBlocks ||
  `    <div style="padding:3rem 2rem;font-family:'Cormorant Garamond',serif;font-style:italic;color:#8a867c;font-size:0.9rem">
      No entries yet — add images to the drawn/ folder.
    </div>`;

// ─── Read & process index.html ────────────────────────────────
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

html = html.replace(
  /<!--DIARY_START-->[\s\S]*?<!--DIARY_END-->/,
  `<!--DIARY_START-->\n${diaryHTML}\n    <!--DIARY_END-->`
);

html = html.replace(
  /<!--DRAWN_START-->[\s\S]*?<!--DRAWN_END-->/,
  `<!--DRAWN_START-->\n${drawnHTML}\n    <!--DRAWN_END-->`
);

fs.writeFileSync(path.join(distDir, 'index.html'), html);

// ─── Copy root-level assets ───────────────────────────────────
// This includes robots.txt, sitemap.xml, and favicon files
['robots.txt', 'sitemap.xml', 'favicon.ico', 'favicon.png', 'favicon.svg'].forEach(f => {
  const src = path.join(__dirname, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, f));
    console.log(`✓ Copied ${f}`);
  }
});

// ─── Summary ─────────────────────────────────────────────────
console.log(`✓ Diary  — ${diaryImages.length} image(s)`);
diaryImages.forEach(img => console.log(`  · ${img} → "${getCaption(img, diaryDir)}"`));
console.log(`✓ Drawn  — ${drawnImages.length} image(s)`);
drawnImages.forEach(img => console.log(`  · ${img} → "${getCaption(img, drawnDir)}"`));
console.log(`✓ Static files copied (robots.txt, sitemap.xml, favicons)`);
console.log(`✓ Output written to dist/`);
