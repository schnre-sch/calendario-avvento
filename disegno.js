/* =========================================================
   IL PUZZLE: la foto del biglietto, già pixelata, nel file
   puzzle.png. Ogni pezzo è un quadrato di "lato" pixel; i pezzi
   sono 24 (6x4 se la foto è orizzontale, 4x6 se è verticale).
   Lo usano sia il sito sia la pagina da stampare.
   ========================================================= */
const PUZZLE = { lato: 8, colonne: 6, righe: 4 };

// Quale pezzo regala ogni casella (casella 1 = primo numero, ecc.).
// I pezzi sono numerati da 0 a 23, da sinistra a destra e dall'alto in basso.
const ORDINE_PEZZI = [5,17,0,12,20,8,3,15,22,10,1,19,6,13,23,21,9,2,16,11,4,18,7,14];

// Legge puzzle.png e restituisce i colori di ogni pixel: px[y][x]
function caricaPuzzle(percorso) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const t = document.createElement("canvas");
      t.width = img.width; t.height = img.height;
      const c = t.getContext("2d");
      c.drawImage(img, 0, 0);
      const d = c.getImageData(0, 0, t.width, t.height).data;
      PUZZLE.colonne = t.width / PUZZLE.lato;
      PUZZLE.righe = t.height / PUZZLE.lato;
      const px = [];
      for (let y = 0; y < t.height; y++) {
        px.push([]);
        for (let x = 0; x < t.width; x++) {
          const i = (y * t.width + x) * 4;
          px[y].push(`rgb(${d[i]},${d[i + 1]},${d[i + 2]})`);
        }
      }
      ok(px);
    };
    img.onerror = ko;
    img.src = percorso;
  });
}

// Dipinge il pezzo numero "pezzo" (0-23) in un quadrato di "lato" pixel.
function dipingiPezzo(ctx, px, pezzo, x0, y0, lato) {
  const L = PUZZLE.lato, s = lato / L;
  const cx = (pezzo % PUZZLE.colonne) * L, cy = Math.floor(pezzo / PUZZLE.colonne) * L;
  for (let y = 0; y < L; y++) for (let x = 0; x < L; x++) {
    ctx.fillStyle = px[cy + y][cx + x];
    ctx.fillRect(x0 + Math.round(x * s), y0 + Math.round(y * s), Math.ceil(s), Math.ceil(s));
  }
}

// Dipinge tutto il puzzle, con pezzi da "lato" pixel.
function dipingiTutto(ctx, px, lato) {
  for (let p = 0; p < 24; p++)
    dipingiPezzo(ctx, px, p, (p % PUZZLE.colonne) * lato, Math.floor(p / PUZZLE.colonne) * lato, lato);
}
