type ParsedHexColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function parseHexColor(color?: string | null): ParsedHexColor | null {
  const rawColor = color?.trim() ?? '';
  if (!rawColor) {
    return null;
  }

  const hex = rawColor.startsWith('#') ? rawColor.slice(1) : rawColor;
  if (!/^[0-9A-Fa-f]+$/.test(hex)) {
    return null;
  }

  if (hex.length === 3) {
    return {
      r: Number.parseInt(`${hex[0]}${hex[0]}`, 16),
      g: Number.parseInt(`${hex[1]}${hex[1]}`, 16),
      b: Number.parseInt(`${hex[2]}${hex[2]}`, 16),
      a: 1,
    };
  }

  if (hex.length === 4) {
    return {
      r: Number.parseInt(`${hex[0]}${hex[0]}`, 16),
      g: Number.parseInt(`${hex[1]}${hex[1]}`, 16),
      b: Number.parseInt(`${hex[2]}${hex[2]}`, 16),
      a: Number.parseInt(`${hex[3]}${hex[3]}`, 16) / 255,
    };
  }

  if (hex.length === 6) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }

  if (hex.length === 8) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: Number.parseInt(hex.slice(6, 8), 16) / 255,
    };
  }

  return null;
}

export function pickSmartIconColor(backgroundColor?: string | null): string {
  const parsed = parseHexColor(backgroundColor);
  if (!parsed) {
    return '#0F172A';
  }

  const { r, g, b, a } = parsed;
  const baseR = Math.round(r * a + 255 * (1 - a));
  const baseG = Math.round(g * a + 255 * (1 - a));
  const baseB = Math.round(b * a + 255 * (1 - a));
  const brightness = (baseR * 299 + baseG * 587 + baseB * 114) / 1000;

  return brightness >= 160 ? '#0F172A' : '#F8FAFC';
}