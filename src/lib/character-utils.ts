import type { CharacterClass } from '../types/game';

export const getCharacterColors = (characterClass: CharacterClass) => {
  switch (characterClass) {
    case 'mage':
      return {
        primary: '#4B0082',
        secondary: '#9370DB',
        accent: '#00CED1',
        skin: '#FFDDC1',
        hair: '#2F1B0C',
      };
    case 'warrior':
      return {
        primary: '#8B0000',
        secondary: '#CD5C5C',
        accent: '#FFD700',
        skin: '#DEB887',
        hair: '#8B4513',
      };
    case 'priest':
      return {
        primary: '#FFFFFF',
        secondary: '#F5F5F5',
        accent: '#FFD700',
        skin: '#FFE4C4',
        hair: '#F5DEB3',
      };
    case 'rogue':
      return {
        primary: '#1F2937',
        secondary: '#4B5563',
        accent: '#EF4444',
        skin: '#DEB887',
        hair: '#111827',
      };
    default:
      return {
        primary: '#334155',
        secondary: '#475569',
        accent: '#94A3B8',
        skin: '#E2E8F0',
        hair: '#1E293B',
      };
  }
};

export const getRankVisuals = (rank: string) => {
  switch (rank) {
    case 'E': return { aura: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', scale: 1.02 };
    case 'D': return { aura: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', scale: 1.04 };
    case 'C': return { aura: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.5)', scale: 1.06 };
    case 'B': return { aura: 'rgba(236, 72, 153, 0.25)', border: 'rgba(236, 72, 153, 0.6)', scale: 1.08 };
    case 'A': return { aura: 'rgba(245, 158, 11, 0.3)', border: 'rgba(245, 158, 11, 0.7)', scale: 1.1 };
    case 'S': return { aura: 'rgba(239, 68, 68, 0.4)', border: 'rgba(239, 68, 68, 0.9)', scale: 1.15, pulse: true };
    default: return { aura: 'transparent', border: 'transparent', scale: 1 };
  }
};
