// Client-side "did they trace the letter" check — no AI, no network call.
//
// Works on two same-sized canvases: the template (the dashed guide letter)
// and the ink (only the child's own strokes, drawn on a transparent layer
// stacked on top of it). We turn the template's shape into a tolerance
// "zone" by dilating it a few pixels, then compare:
//   - coverage:  how much of that zone the child's ink fills in (did they
//                actually trace the letter, not just scribble a corner)
//   - precision: how much of the child's ink falls inside that zone
//                (did they stay roughly on the lines, not scribble randomly)

// Two-pass (horizontal then vertical) box dilation — O(w*h), independent of
// the tolerance radius, so it stays fast even on a full-size canvas.
function dilateMask(mask, width, height, radius) {
  if (radius <= 0) return mask;

  const rowPass = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const base = y * width;
    let count = 0;
    for (let x = -radius; x < width; x++) {
      const inIdx = x + radius;
      if (inIdx < width && mask[base + inIdx]) count++;
      const outIdx = x - radius - 1;
      if (outIdx >= 0 && mask[base + outIdx]) count--;
      if (x >= 0) rowPass[base + x] = count > 0 ? 1 : 0;
    }
  }

  const out = new Uint8Array(width * height);
  for (let x = 0; x < width; x++) {
    let count = 0;
    for (let y = -radius; y < height; y++) {
      const inIdx = y + radius;
      if (inIdx < height && rowPass[inIdx * width + x]) count++;
      const outIdx = y - radius - 1;
      if (outIdx >= 0 && rowPass[outIdx * width + x]) count--;
      if (y >= 0) out[y * width + x] = count > 0 ? 1 : 0;
    }
  }
  return out;
}

const INK_ALPHA_THRESHOLD = 40;

function alphaMask(imageData) {
  const { data, width, height } = imageData;
  const mask = new Uint8Array(width * height);
  for (let p = 0, i = 0; p < width * height; p++, i += 4) {
    mask[p] = data[i + 3] > INK_ALPHA_THRESHOLD ? 1 : 0;
  }
  return mask;
}

// templateCanvas: the guide letter only. inkCanvas: the child's strokes only
// (same pixel dimensions as templateCanvas). tolerancePx scales with how
// thick the guide stroke/brush is, so it stays fair at any canvas size.
export function scoreTraceMatch(templateCanvas, inkCanvas, tolerancePx = 16) {
  const width = templateCanvas.width;
  const height = templateCanvas.height;

  const templateMask = alphaMask(templateCanvas.getContext('2d').getImageData(0, 0, width, height));
  const inkMask = alphaMask(inkCanvas.getContext('2d').getImageData(0, 0, width, height));
  const zone = dilateMask(templateMask, width, height, tolerancePx);

  let zoneCount = 0, zoneCoveredByInk = 0, inkCount = 0, inkInZone = 0;
  for (let p = 0; p < width * height; p++) {
    if (zone[p]) {
      zoneCount++;
      if (inkMask[p]) zoneCoveredByInk++;
    }
    if (inkMask[p]) {
      inkCount++;
      if (zone[p]) inkInZone++;
    }
  }

  const coverage = zoneCount > 0 ? zoneCoveredByInk / zoneCount : 0;
  const precision = inkCount > 0 ? inkInZone / inkCount : 0;

  // Kid-friendly thresholds, tuned against real traced strokes rather than
  // guessed: a bold glyph's full outline (including small inner counters,
  // e.g. the triangle inside a capital "A") is a lot of path for a young
  // child to fully retrace, so coverage is only a light "drew enough of
  // it, somewhere" floor. precision carries the real weight — it's what
  // distinguishes "traced roughly along the letter" from "scribbled
  // somewhere else on the canvas": real traces comfortably clear 0.9+
  // precision while off-target scribbles score close to 0. inkCount
  // guards against a single tiny, technically-on-target speck.
  const passed = inkCount > 400 && coverage >= 0.05 && precision >= 0.45;

  return { coverage, precision, inkCount, passed };
}
