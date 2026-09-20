import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SIZE = 16;
const SCALE = 2;
const OUT = join(process.cwd(), "public", "textures");

mkdirSync(OUT, { recursive: true });

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rgba(r, g, b, a = 255) {
  return [r & 0xff, g & 0xff, b & 0xff, a & 0xff];
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

// Value-noise helper: builds a grid of random values and bilinear-interpolates.
function makeNoise(seed, size, cellPx) {
  const rng = mulberry32(seed);
  const cells = Math.ceil(size / cellPx) + 2;
  const grid = [];
  for (let i = 0; i < cells * cells; i++) grid.push(rng());
  const get = (cx, cy) => grid[((cy + cells) % cells) * cells + ((cx + cells) % cells)];
  return (x, y) => {
    const cx = Math.floor(x / cellPx);
    const cy = Math.floor(y / cellPx);
    const fx = (x - cx * cellPx) / cellPx;
    const fy = (y - cy * cellPx) / cellPx;
    const s = (t) => t * t * (3 - 2 * t);
    const u = s(fx);
    const v = s(fy);
    const a = get(cx, cy);
    const b = get(cx + 1, cy);
    const c = get(cx, cy + 1);
    const d = get(cx + 1, cy + 1);
    return mix(mix(a, b, u), mix(c, d, u), v);
  };
}

function encodePng(width, height, pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  function crc32(buf) {
    let c = ~0;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return ~c >>> 0;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    for (let x = 0; x < width * 4; x++) {
      raw[y * (width * 4 + 1) + 1 + x] = pixels[y * width * 4 + x];
    }
  }

  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function upscale(pixels, size, scale) {
  const out = [];
  for (let y = 0; y < size * scale; y++) {
    for (let x = 0; x < size * scale; x++) {
      const sx = Math.floor(x / scale);
      const sy = Math.floor(y / scale);
      const i = (sy * size + sx) * 4;
      out.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    }
  }
  return out;
}

function render(name, colorFn) {
  const pixels = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const c = colorFn(x, y, SIZE);
      pixels.push(c[0], c[1], c[2], c[3] ?? 255);
    }
  }
  const png = encodePng(SIZE * SCALE, SIZE * SCALE, upscale(pixels, SIZE, SCALE));
  writeFileSync(join(OUT, `${name}.png`), png);
  console.log(`generated ${name}.png (${png.length} bytes)`);
}

// --- Grass block top
{
  const noise = makeNoise(1337, SIZE, 4);
  const base = [124, 189, 107];
  render("grass-top", (x, y) => {
    const v = noise(x, y) * 2 - 1;
    let r = mix(base[0], 170, v * 0.35);
    let g = mix(base[1], 210, v * 0.25);
    let b = mix(base[2], 92, v * 0.3);
    // sparse darker blades
    const blade = makeNoise(99 + x * 7 + y * 13, SIZE, 2)(x, y);
    if (blade > 0.72) {
      r = mix(r, 66, 0.5);
      g = mix(g, 128, 0.5);
      b = mix(b, 60, 0.5);
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

// --- Grass block side (grass fringe over dirt)
{
  const noise = makeNoise(555, SIZE, 4);
  const dirtNoise = makeNoise(777, SIZE, 6);
  render("grass-side", (x, y) => {
    const edge = Math.floor(mix(3, 4, makeNoise(321, SIZE, 6)(x, 0)));
    const isGrass = y <= edge;
    if (isGrass) {
      const c = [110, 178, 92];
      const v = noise(x, y) * 2 - 1;
      const darker = v > 0.35;
      let r = mix(c[0], 90, v * 0.4);
      let g = mix(c[1], 190, v * 0.3);
      let b = mix(c[2], 85, v * 0.4);
      if (darker) {
        r *= 0.82;
        g *= 0.85;
        b *= 0.78;
      }
      return rgba(Math.round(r), Math.round(g), Math.round(b));
    }
    const de = dirtNoise(x, y) * 2 - 1;
    const base = [134, 96, 67];
    const t = 0.5 + de * 0.42;
    return rgba(
      Math.round(mix(base[0], 175, t)),
      Math.round(mix(base[1], 132, t)),
      Math.round(mix(base[2], 94, t)),
      255,
    );
  });
}

// --- Dirt
{
  const noise = makeNoise(4242, SIZE, 4);
  render("dirt", (x, y) => {
    const v = noise(x, y) * 2 - 1;
    const base = [134, 96, 67];
    const t = 0.55 + v * 0.4;
    let r = mix(base[0], 178, t);
    let g = mix(base[1], 128, t);
    let b = mix(base[2], 88, t);
    // darker pebbles / roots
    const bump = makeNoise(2020 + x, SIZE, 3)(x, y);
    if (bump > 0.68) {
      r = mix(r, 110, 0.45);
      g = mix(g, 80, 0.45);
      b = mix(b, 58, 0.45);
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

// --- Stone
{
  const noise = makeNoise(888, SIZE, 4);
  render("stone", (x, y) => {
    const v = noise(x, y) * 2 - 1;
    const base = [125, 125, 125];
    let r = mix(base[0], 150, v * 0.6);
    let g = mix(base[1], 150, v * 0.6);
    let b = mix(base[2], 150, v * 0.6);
    const crack = makeNoise(1313, SIZE, 8)(x, y);
    if (crack > 0.68) {
      const f = 0.6;
      r *= f;
      g *= f;
      b *= f;
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

// --- Cobblestone
{
  const noise = makeNoise(7777, SIZE, 6);
  render("cobblestone", (x, y) => {
    const cx = Math.floor(x / 4);
    const cy = Math.floor(y / 4);
    const blockNoise = makeNoise(cx * 31 + cy * 17, SIZE, 1)(0, 0);
    const v = noise(x, y) * 2 - 1;
    const light = 108 + blockNoise * 34;
    let r = light + v * 14;
    let g = light + v * 14;
    let b = light + v * 14;
    // grout lines between 4x4 blocks
    const isEdge =
      x % 4 === 0 || y % 4 === 0 || x % 4 === 3 || y % 4 === 3;
    if (isEdge) {
      r *= 0.62;
      g *= 0.62;
      b *= 0.62;
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

// --- Oak planks
{
  const noise = makeNoise(202, SIZE, 3);
  const grain = makeNoise(303, SIZE, 2);
  render("planks", (x, y) => {
    // 2 planks stacked vertically, seam in the middle; vertical seams every 8px.
    const plank = Math.floor(y / 8);
    const baseRow = plank === 0 ? [162, 130, 83] : [150, 121, 79];
    const v = noise(x, y) * 2 - 1;
    // plank offset seams alternate
    const seamX = ((x % 8) + (plank === 1 ? 4 : 0)) % 8;
    let r = mix(baseRow[0], 190, v * 0.5);
    let g = mix(baseRow[1], 158, v * 0.5);
    let b = mix(baseRow[2], 96, v * 0.5);
    // grain streaks
    const gr = grain(x, y);
    if (gr > 0.62) {
      r = mix(r, 120, 0.3);
      g = mix(g, 95, 0.3);
      b = mix(b, 62, 0.3);
    }
    // seams
    const isHorizontalSeam = y === 7 || y === 8;
    const isVerticalSeam = seamX === 0 || seamX === 7;
    if (isHorizontalSeam || isVerticalSeam) {
      const f = 0.5;
      r *= f;
      g *= f;
      b *= f;
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

// --- Sand
{
  const noise = makeNoise(4040, SIZE, 3);
  render("sand", (x, y) => {
    const v = noise(x, y) * 2 - 1;
    const base = [219, 207, 163];
    let r = mix(base[0], 240, v * 0.4);
    let g = mix(base[1], 224, v * 0.4);
    let b = mix(base[2], 168, v * 0.5);
    const dot = makeNoise(5050 + x, SIZE, 2)(x, y);
    if (dot > 0.78) {
      r *= 0.88;
      g *= 0.9;
      b *= 0.86;
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

// --- Obsidian
{
  const noise = makeNoise(606, SIZE, 4);
  render("obsidian", (x, y) => {
    const v = noise(x, y) * 2 - 1;
    let r = mix(19, 34, v * 0.8);
    let g = mix(14, 30, v * 0.8);
    let b = mix(26, 46, v * 0.8);
    const shine = makeNoise(707 + x, SIZE, 6)(x, y);
    if (shine > 0.8) {
      const f = 1.4;
      r = Math.min(255, r * f);
      g = Math.min(255, g * f);
      b = Math.min(255, b * f);
    }
    return rgba(Math.round(r), Math.round(g), Math.round(b));
  });
}

console.log("All textures generated.");