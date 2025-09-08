import { readFile } from 'fs/promises';

// Small helper: convert hex color to RGB [0,1]
function hexToRgb(hex) {
  const n = parseInt(hex.replace('#',''), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255].map(v => v / 255);
}

// Relative luminance per WCAG
function luminance([r,g,b]) {
  const ch = [r,g,b].map(v => {
    return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4);
  });
  return 0.2126*ch[0] + 0.7152*ch[1] + 0.0722*ch[2];
}

function contrast(a, b) {
  const L1 = luminance(hexToRgb(a));
  const L2 = luminance(hexToRgb(b));
  const [bright, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (bright + 0.05) / (dark + 0.05);
}

async function main() {
  const url = new URL('../data/palette.json', import.meta.url);
  const text = await readFile(url, 'utf8');
  const pal = JSON.parse(text);
  console.log('Contrast bg vs ink:', contrast(pal.bg, pal.ink).toFixed(2));
  (pal.layers || []).forEach((color,i) => {
    console.log(`Contrast bg vs layer ${i+1}:`, contrast(pal.bg, color).toFixed(2));
  });
}

main().catch(err => {
  console.error('Could not read palette:', err.message);
});
