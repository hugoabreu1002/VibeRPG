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
