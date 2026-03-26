const fs = require('fs');
const path = require('path');

const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// ─── Directories ─────────────────────────────────────────────
const diaryDir  = path.join(__dirname, 'diary');
const drawnDir  = path.join(__dirname, 'drawn');
const distDir   = path.join(__dirname, 'dist');
const diaryDist = path.join(distDir, 'diary');
const drawnDist = path.join(distDir, 'drawn');

// Create dist folders
if (!fs.existsSync(distDir))     fs.mkdirSync(distDir);
if (!fs.existsSync(diaryDist))   fs.mkdirSync(diaryDist);
if (!fs.existsSync(drawnDist))   fs.mkdirSync(drawnDist);

// ─── Helper: read a folder, copy images to dist, return sorted list ──
function readImageFolder(srcDir, destDir) {
  const allFiles = fs.existsSync(srcDir) ? fs.readdirSync(srcDir) : [];
  allFiles.forEach(f => {
    fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
  });
  return allFiles
    .filter(f => imageExts.includes(path.extname(f).toLowerCase()))
    .sort()
    .reverse(); // newest first (YYYY-MM-DD prefix)
}

// ─── Helper: derive caption from filename or .txt sidecar ────
function getCaption(filename, srcDir) {
  const base = path.basename(filename, path.extname(filename));
  const txtFile = path.join(srcDir, base + '.txt');

  if (fs.existsSync(txtFile)) {
    return fs.readFileSync(txtFile, 'utf8').trim();
  }

  // e.g. "2025-03-24-drawing01" → "drawing01, 24 Mar 2025"
  const parts = base.split('-');
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

// ─── Helper: extract date attribute from filename ─────────────
function getDateAttr(filename) {
  const base = path.basename(filename, path.extname(filename));
  const parts = base.split('-');
  return (parts.length >= 3 && /^\d{4}$/.test(parts[0]))
    ? `data-date="${parts[0]}-${parts[1]}-${parts[2]}"`
    : '';
}

// ─── Build DIARY blocks ──────────────────────────────────────
const diaryImages = readImageFolder(diaryDir, diaryDist);

const diaryBlocks = diaryImages.map(img => {
  const caption = getCaption(img, diaryDir);
  const dateAttr = getDateAttr(img);
  return `    <div class="mood-item" ${dateAttr}>
      <img class="mood-img" src="diary/${img}" alt="${caption}" loading="lazy">
      <div class="mood-cap">${caption}</div>
    </div>`;
}).join('\n');

const diaryHTML = diaryBlocks || `    <div style="padding:3rem 2rem;font-family:'Cormorant Garamond',serif;font-style:italic;color:#8a867c;font-size:0.9rem">
      No entries yet — add images to the diary/ folder.
    </div>`;

// ─── Build DRAWN blocks ──────────────────────────────────────
const drawnImages = readImageFolder(drawnDir, drawnDist);

const drawnBlocks = drawnImages.map(img => {
  const caption = getCaption(img, drawnDir);
  const dateAttr = getDateAttr(img);
  return `    <div class="drawn-item" ${dateAttr}>
      <img class="drawn-img" src="drawn/${img}" alt="${caption}" loading="lazy">
      <span class="drawn-lbl">${caption}</span>
    </div>`;
}).join('\n');

const drawnHTML = drawnBlocks || `    <div style="padding:3rem 2rem;font-family:'Cormorant Garamond',serif;font-style:italic;color:#8a867c;font-size:0.9rem">
      No entries yet — add images to the drawn/ folder.
    </div>`;

// ─── Read & process index.html ───────────────────────────────
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Inject diary
html = html.replace(
  /<!--DIARY_START-->[\s\S]*?<!--DIARY_END-->/,
  `<!--DIARY_START-->\n${diaryHTML}\n    <!--DIARY_END-->`
);

// Inject drawn works
html = html.replace(
  /<!--DRAWN_START-->[\s\S]*?<!--DRAWN_END-->/,
  `<!--DRAWN_START-->\n${drawnHTML}\n    <!--DRAWN_END-->`
);

fs.writeFileSync(path.join(distDir, 'index.html'), html);

// Copy static assets if present
['robots.txt', 'favicon.ico', 'favicon.png'].forEach(f => {
  const src = path.join(__dirname, f);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(distDir, f));
});

// ─── Summary ─────────────────────────────────────────────────
console.log(`✓ Diary   — ${diaryImages.length} image(s)`);
diaryImages.forEach(img => console.log(`  · ${img} → "${getCaption(img, diaryDir)}"`));

console.log(`✓ Drawn   — ${drawnImages.length} image(s)`);
drawnImages.forEach(img => console.log(`  · ${img} → "${getCaption(img, drawnDir)}"`));

console.log(`✓ Output written to dist/`);
