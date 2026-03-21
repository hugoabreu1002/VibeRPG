import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMonsterColors(sprite: string = 'default', name: string = '') {
  const hash = (sprite + name).split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const h = Math.abs(hash % 360);
  return {
    primary: `hsla(${h}, 70%, 50%, 0.4)`,
    secondary: `hsla(${(h + 40) % 360}, 80%, 60%, 0.3)`,
    accent: `hsla(${(h + 180) % 360}, 90%, 70%, 0.5)`,
    hue: h
  };
}
