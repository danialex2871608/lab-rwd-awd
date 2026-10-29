/**
 * Genera las imágenes de producto en 3 resoluciones y 3 formatos:
 *   public/img/p{id}-{400|800|1600}.{avif|webp|jpg}
 *
 * Son ilustraciones sintéticas (gradiente + "rack" dibujado + ruido ligero)
 * para tener archivos de tamaño realista sin depender de fotos con licencia.
 * Puedes reemplazarlas por fotos reales usando los mismos nombres.
 *
 * Uso: npm run build:images
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { products } = require('../data/products');

const OUT = path.join(__dirname, '..', 'public', 'img');
const WIDTHS = [400, 800, 1600];
const BASE_W = 1600;
const BASE_H = 1200; // relación 4:3

fs.mkdirSync(OUT, { recursive: true });

function svgFor(product) {
  const hue = (product.id * 29) % 360;
  const units = 3 + (product.id % 4); // número de "unidades" de rack dibujadas
  let rows = '';
  for (let i = 0; i < units; i++) {
    const y = 300 + i * 150;
    rows += `
      <rect x="260" y="${y}" width="1080" height="120" rx="10" fill="hsl(${hue},25%,18%)" stroke="hsl(${hue},60%,60%)" stroke-width="3"/>
      <rect x="290" y="${y + 40}" width="520" height="40" rx="6" fill="hsl(${hue},20%,30%)"/>
      <circle cx="1200" cy="${y + 60}" r="14" fill="hsl(${(hue + 120) % 360},80%,55%)"/>
      <circle cx="1250" cy="${y + 60}" r="14" fill="hsl(${hue},80%,60%)"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BASE_W}" height="${BASE_H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${hue},55%,28%)" stop-opacity="0.9"/>
        <stop offset="1" stop-color="hsl(${(hue + 60) % 360},60%,12%)" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    ${rows}
  </svg>`;
}

async function buildOne(product) {
  // Fondo con ruido gaussiano (da textura y peso realista de "foto").
  const noise = await sharp({
    create: {
      width: BASE_W, height: BASE_H, channels: 3,
      background: { r: 20, g: 30, b: 50 },
      noise: { type: 'gaussian', mean: 128, sigma: 14 }
    }
  }).png().toBuffer();

  const base = await sharp(noise)
    .composite([{ input: Buffer.from(svgFor(product)) }])
    .png()
    .toBuffer();

  for (const w of WIDTHS) {
    const resized = sharp(base).resize({ width: w });
    const name = `p${product.id}-${w}`;
    await resized.clone().avif({ quality: 50, effort: 2 }).toFile(path.join(OUT, `${name}.avif`));
    await resized.clone().webp({ quality: 75 }).toFile(path.join(OUT, `${name}.webp`));
    await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  }
  console.log(`✔ producto ${product.id} (${product.name})`);
}

(async () => {
  for (const p of products) await buildOne(p);
  console.log(`\nListo: ${products.length * WIDTHS.length * 3} archivos en public/img/`);
})().catch(err => { console.error(err); process.exit(1); });
