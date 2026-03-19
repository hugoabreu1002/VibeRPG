// Animation types for the RPG

export type CharacterClass = 'mage' | 'warrior' | 'priest' | 'rogue';

export interface SpriteConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimationFrame {
  x: number;
  y: number;
  duration: number;
}

export interface AnimationSequence {
  name: string;
  frames: AnimationFrame[];
  loop: boolean;
}

export type BattleAnimationType = 
  | 'idle' 
  | 'attack' 
  | 'spell' 
  | 'defend' 
  | 'hit' 
  | 'victory' 
  | 'defeat';

export interface AnimationState {
  isPlaying: boolean;
  currentAnimation: BattleAnimationType;
  progress: number;
}

export interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}
