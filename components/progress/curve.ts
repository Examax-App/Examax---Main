/**
 * A smooth line through chart points that never overshoots them — the
 * monotone cubic (Fritsch–Carlson) that d3's `curveMonotoneX` draws. The
 * reference plots straight segments; the progress charts keep its points but
 * join them softly, so a dip reads as a dip rather than a spike.
 */
export function monotonePath(points: ReadonlyArray<readonly [number, number]>) {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M${points[0][0]},${points[0][1]}`;

  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1][0] - points[i][0];
    slope[i] = (points[i + 1][1] - points[i][1]) / dx[i];
  }

  // Tangents: the mean of the neighbouring slopes, flattened at a turn.
  const tangent: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  tangent[n - 1] = slope[n - 2];

  // Fritsch–Carlson: rein in any tangent that would push the curve past a point.
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / slope[i];
    const b = tangent[i + 1] / slope[i];
    const length = Math.hypot(a, b);
    if (length > 3) {
      const scale = 3 / length;
      tangent[i] = scale * a * slope[i];
      tangent[i + 1] = scale * b * slope[i];
    }
  }

  const f = (value: number) => Math.round(value * 100) / 100;
  let d = `M${f(points[0][0])},${f(points[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const third = dx[i] / 3;
    d += `C${f(x0 + third)},${f(y0 + tangent[i] * third)},${f(x1 - third)},${f(y1 - tangent[i + 1] * third)},${f(x1)},${f(y1)}`;
  }
  return d;
}
