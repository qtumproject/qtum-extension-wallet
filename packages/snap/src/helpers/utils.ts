export const makeSpacerSVG = (width: number = 1, height: number = 1): string => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="transparent"/></svg>`;

export function relativePathToDeriveSegments(relative: string): string[] {
  return relative.replace(/^m\//, '').split('/').map((seg) => seg.trim()).filter(Boolean).map((seg) => `bip32:${seg}`);
}
