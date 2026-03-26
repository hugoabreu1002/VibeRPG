/**
 * Poki Service for VibeRPG
 * Encapsulates Poki SDK logic for compliance and monetization.
 */

// Declare PokiSDK for TypeScript
declare global {
  interface Window {
    PokiSDK: any;
  }
}

class PokiService {
  private sdk: any = null;
  private isInitialized: boolean = false;
  private isAdPlaying: boolean = false;

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.PokiSDK) {
      console.warn("Poki SDK not found");
      return;
    }

    return new Promise((resolve) => {
      window.PokiSDK.init().then(() => {
        this.isInitialized = true;
        this.sdk = window.PokiSDK;
        console.log("Poki SDK successfully initialized");
        this.setupEventListeners();
        resolve();
      }).catch(() => {
        console.warn("Poki SDK initialization failed, continuing anyway");
        this.isInitialized = true; // Still mark as "initialized" so game logic proceeds
        this.sdk = window.PokiSDK;
        resolve();
      });
    });
  }

  private setupEventListeners() {
    // Prevent page jump for Arrow keys and Space
    window.addEventListener('keydown', ev => {
      if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
        ev.preventDefault();
      }
    });

    // Also prevent wheel scrolling
    window.addEventListener('wheel', ev => {
        // Only prevent if the game is active or an ad is playing
        if (this.isAdPlaying) {
            ev.preventDefault();
        }
    }, { passive: false });
  }

  gameLoadingFinished() {
    if (this.sdk) {
      this.sdk.gameLoadingFinished();
    }
  }

  gameplayStart() {
    if (this.sdk) {
      this.sdk.gameplayStart();
    }
  }

  gameplayStop() {
    if (this.sdk) {
      this.sdk.gameplayStop();
    }
  }

  commercialBreak(onStart?: () => void): Promise<void> {
    if (!this.sdk) return Promise.resolve();

    return new Promise((resolve) => {
      this.isAdPlaying = true;
      if (onStart) onStart();

      this.sdk.commercialBreak().then(() => {
        this.isAdPlaying = false;
        resolve();
      });
    });
  }

  rewardedBreak(options: { size?: 'small' | 'medium' | 'large', onStart?: () => void } = {}): Promise<boolean> {
    if (!this.sdk) return Promise.resolve(false);

    return new Promise((resolve) => {
      this.isAdPlaying = true;
      if (options.onStart) options.onStart();

      this.sdk.rewardedBreak(options).then((success: boolean) => {
        this.isAdPlaying = false;
        resolve(success);
      });
    });
  }

  isAdActive(): boolean {
    return this.isAdPlaying;
  }
}

export const pokiService = new PokiService();
