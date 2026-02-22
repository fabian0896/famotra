export function getContrastColor(hsl: string): string {
  // Extraer valores del hsl
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return '#ffffff';

  const h = parseInt(match[1]);
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  // Convertir HSL a RGB
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };

  const r = f(0);
  const g = f(8);
  const b = f(4);

  // Calcular luminancia relativa WCAG
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  // Retornar negro o blanco según contraste
  return luminance > 0.2 ? '#000000' : '#ffffff';
}

export function generateColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 20) + 75; // 75-95% — vívidos sin llegar a neón
  const lightness = Math.floor(Math.random() * 10) + 57; // 57-67% — luminosos sobre fondo oscuro

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
