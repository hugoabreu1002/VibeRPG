/**
 * Audio Manager for VibeRPG
 * Provides a simple interface for BGM and Sound Effects
 * uses Web Audio API for synthesized sounds and Audio objects for music
 */

export type SoundEffect = 
  | 'click' 
  | 'attack' 
  | 'spell' 
  | 'hit' 
  | 'victory' 
  | 'defeat' 
  | 'levelUp'
  | 'questAccept';

export type MusicTrack = 
  | 'main' 
  | 'battle' 
  | 'battle_forest'
  | 'battle_undead'
  | 'battle_fire'
  | 'battle_boss'
  | 'battle_magical'
  | 'dungeon';

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private currentBgm: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.5;
  private sfxVolume: number = 0.5;
  private isMuted: boolean = false;
  private musicTracks: Record<MusicTrack, string> = {
    main: "https://www.soundjay.com/nature/sounds/river-1.mp3",
    battle: "https://www.soundjay.com/nature/sounds/rain-01.mp3",
    battle_forest: "https://www.soundjay.com/nature/sounds/forest-wind-1.mp3",
    battle_undead: "https://www.soundjay.com/nature/sounds/wind-1.mp3",
    battle_fire: "https://www.soundjay.com/nature/sounds/fire-1.mp3",
    battle_boss: "https://www.soundjay.com/nature/sounds/thunder-1.mp3",
    battle_magical: "https://www.soundjay.com/nature/sounds/wind-2.mp3",
    dungeon: "https://www.soundjay.com/nature/sounds/wind-1.mp3",
  };
  
  // Real BGM sources (Kevin MacLeod / Pixabay - Creative Commons)
  private realMusicTracks: Record<MusicTrack, string> = {
    main: "https://cdn.pixabay.com/audio/2022/10/14/audio_3e95123512.mp3", // "Fantasy World"
    battle: "https://cdn.pixabay.com/audio/2023/10/25/audio_5b3eb7b79a.mp3", // "Epic Battle"
    battle_forest: "https://cdn.pixabay.com/audio/2022/03/15/audio_7315cc969a.mp3", // "Adventure"
    battle_undead: "https://cdn.pixabay.com/audio/2021/11/24/audio_985532d52f.mp3", // "Dark Mystery"
    battle_fire: "https://cdn.pixabay.com/audio/2023/11/04/audio_3d332d7337.mp3", // "Aggressive Metal"
    battle_boss: "https://cdn.pixabay.com/audio/2022/03/10/audio_c76ae75f8f.mp3", // "Epic Cinematic"
    battle_magical: "https://cdn.pixabay.com/audio/2023/06/11/audio_540986689d.mp3", // "Magic World"
    dungeon: "https://cdn.pixabay.com/audio/2022/01/18/audio_6c9e0d164d.mp3", // "Dark Dungeon"
  };

  private isStarted: boolean = false;

  constructor() {
    // We don't initialize context here because of browser autoplay policies
  }

  private initContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended' && !this.isMuted) {
      this.audioCtx.resume();
    }
  }

  start() {
    this.initContext();
    this.isStarted = true;
  }

  playBgm(track: MusicTrack) {
    if (!this.isStarted) return;
    
    // Stop current track if it's different
    if (this.currentBgm) {
      if (this.currentBgm.src === this.realMusicTracks[track]) return;
      this.stopBgm();
    }

    this.currentBgm = new Audio(this.realMusicTracks[track]);
    this.currentBgm.loop = true;
    this.updateBgmVolume();
    
    this.currentBgm.play().catch(e => console.warn("BGM Play failed:", e));
  }

  stopBgm() {
    if (this.currentBgm) {
      this.currentBgm.pause();
      this.currentBgm = null;
    }
  }

  setBgmVolume(v: number) {
    this.bgmVolume = v;
    this.updateBgmVolume();
  }

  private updateBgmVolume() {
    if (this.currentBgm) {
      this.currentBgm.volume = this.isMuted ? 0 : this.bgmVolume;
      this.currentBgm.muted = this.isMuted;
    }
  }

  setSfxVolume(v: number) {
    this.sfxVolume = v;
  }

  setMasterMute(muted: boolean) {
    this.isMuted = muted;
    this.updateBgmVolume();
    
    if (this.audioCtx) {
      if (muted) {
        this.audioCtx.suspend();
      } else {
        this.audioCtx.resume();
      }
    }
  }

  // Synthesized Sound Effects (No assets needed!)
  playSfx(type: SoundEffect) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(this.sfxVolume, now);
    out.connect(ctx.destination);

    switch(type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'attack': {
        const noise = ctx.createBufferSource();
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.2);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(out);
        noise.start(now);
        noise.stop(now + 0.2);
        break;
      }
      case 'spell': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'hit': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'victory': {
        // Simple major scale flourish
        const freqs = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.1);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.5);
        });
        break;
      }
      case 'defeat': {
        // Sad slide down
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(60, now + 1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 1);
        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 1);
        break;
      }
      case 'levelUp': {
        const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(f, now + i * 0.08);
          gain.gain.setValueAtTime(0.1, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
        break;
      }
      case 'questAccept': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(out);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
    }
  }
}

export const audioManager = new AudioManager();
