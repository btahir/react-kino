/** Linear interpolation between a and b by factor t */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
