// Checks a design sent by the browser and returns a clean copy, or throws with a short reason.
const PRODUCTS = { jersey: ['toddler', 'youth'], cap: ['one'], ball: ['official'] };
const FONTS = ['varsity', 'slab', 'block', 'speed', 'own'];
const TEXTS = ['numFront', 'nameBack', 'numBack'];
const BLOB_HOST = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/uploads\/[A-Za-z0-9._-]+\.png$/;

const num = (v, lo, hi, what) => {
  if (typeof v !== 'number' || !isFinite(v) || v < lo || v > hi) throw new Error('bad ' + what);
  return Math.round(v);
};
const str = (v, max, what) => {
  if (v == null) return '';
  if (typeof v !== 'string' || v.length > max) throw new Error('bad ' + what);
  return v;
};

export function cleanDesign(d) {
  if (!d || typeof d !== 'object') throw new Error('bad design');
  const sizes = PRODUCTS[d.id];
  if (!sizes) throw new Error('bad product');
  if (!sizes.includes(d.size)) throw new Error('bad size');
  const out = { id: d.id, size: d.size, files: [] };
  if (!Array.isArray(d.files) || d.files.length > 6) throw new Error('bad files');
  for (const f of d.files) {
    if (!f || typeof f.url !== 'string' || !BLOB_HOST.test(f.url)) throw new Error('bad file url');
    out.files.push({
      url: f.url, side: f.side === 'back' && d.id === 'jersey' ? 'back' : 'front',
      x: num(f.x, 0, 100, 'file x'), y: num(f.y, 0, 100, 'file y'), w: num(f.w, 1, 100, 'file width'),
    });
  }
  if (d.id === 'jersey') {
    if (!FONTS.includes(d.font)) throw new Error('bad font');
    out.font = d.font;
    if (d.font !== 'own') {
      out.nombre = str(d.nombre, 12, 'name');
      out.numero = str(d.numero, 2, 'number');
      if (!/^[0-9]*$/.test(out.numero)) throw new Error('bad number');
      if (d.place != null) {
        if (typeof d.place !== 'object') throw new Error('bad placement');
        out.place = {};
        for (const k of TEXTS) {
          const p = d.place[k];
          if (p == null) continue;
          if (!Array.isArray(p) || p.length !== 3) throw new Error('bad placement');
          out.place[k] = [num(p[0], 0, 100, 'x'), num(p[1], 0, 100, 'y'), num(p[2], 50, 180, 'scale')];
        }
      }
    }
  }
  if (d.id === 'ball') out.texto = str(d.texto, 16, 'text');
  return out;
}
