/**
 * Poki SDK TypeScript Wrapper
 * Provides type-safe access to Poki SDK functions for game monetization
 */

// Extend the Window interface to include PokiSDK
declare global {
  interface Window {
    PokiSDK?: PokiSDKInstance;
  }
}

interface PokiSDKInstance {
  init(): Promise<void>;
  gameLoadingFinished(): void;
  gameplayStart(): void;
  gameplayStop(): void;
  commercialBreak(callback?: () => void): Promise<void>;
  rewardedBreak(
    optionsOrCallback?:
      | (() => void)
      | {
          size?: "small" | "medium" | "large";
          onStart?: () => void;
        },
    callback?: () => void
  ): Promise<boolean>;
}

class PokiSDKWrapper {
  private static instance: PokiSDKWrapper;
  private sdk: PokiSDKInstance | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private gameplayActive = false;
  private isDevelopment = false;

  private constructor() {
    // Don't check for PokiSDK here - it may not be loaded yet
  }

  static getInstance(): PokiSDKWrapper {
    if (!PokiSDKWrapper.instance) {
      PokiSDKWrapper.instance = new PokiSDKWrapper();
    }
    return PokiSDKWrapper.instance;
  }

  /**
   * Wait for PokiSDK to be available
   * @param maxWaitMs Maximum time to wait in milliseconds
   * @returns Promise that resolves when PokiSDK is available or timeout
   */
  private waitForPokiSDK(maxWaitMs: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if already available
      if (typeof window !== "undefined" && window.PokiSDK) {
        resolve(true);
        return;
      }

      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (typeof window !== "undefined" && window.PokiSDK) {
          clearInterval(checkInterval);
          resolve(true);
        } else if (Date.now() - startTime >= maxWaitMs) {
          clearInterval(checkInterval);
          resolve(false);
        }
      }, 100);
    });
  }

  /**
   * Initialize the Poki SDK
   * @returns Promise that resolves when SDK is initialized
   */
  async init(): Promise<void> {
    if (this.initialized) {
      console.log("[Poki SDK] Already initialized");
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise<void>(async (resolve) => {
      // Wait for PokiSDK to be available
      const sdkAvailable = await this.waitForPokiSDK();
      
      if (sdkAvailable && window.PokiSDK) {
        this.sdk = window.PokiSDK;
        console.log("[Poki SDK] SDK found, initializing...");
        
        try {
          await this.sdk.init();
          console.log("[Poki SDK] Successfully initialized");
          this.initialized = true;
          resolve();
        } catch (error) {
          console.log("[Poki SDK] Initialization failed, but continuing anyway", error);
          this.initialized = true;
          resolve();
        }
      } else {
        // PokiSDK not available - development mode
        this.isDevelopment = true;
        console.log("[Poki SDK] Not available - running in development mode");
        this.initialized = true;
        resolve();
      }
    });

    return this.initPromise;
  }

  /**
   * Call when game loading has finished
   * This helps Poki track conversion-to-play metrics
   */
  gameLoadingFinished(): void {
    if (!this.initialized || !this.sdk) {
      console.log("[Poki SDK] gameLoadingFinished - SDK not ready");
      return;
    }

    console.log("[Poki SDK] gameLoadingFinished");
    this.sdk.gameLoadingFinished();
  }

  /**
   * Call when gameplay starts (e.g., level start, unpause)
   */
  gameplayStart(): void {
    if (!this.initialized || !this.sdk) {
      console.log("[Poki SDK] gameplayStart - SDK not ready");
      return;
    }

    if (!this.gameplayActive) {
      console.log("[Poki SDK] gameplayStart");
      this.sdk.gameplayStart();
      this.gameplayActive = true;
    }
  }

  /**
   * Call when gameplay stops (e.g., game over, pause, menu)
   */
  gameplayStop(): void {
    if (!this.initialized || !this.sdk) {
      console.log("[Poki SDK] gameplayStop - SDK not ready");
      return;
    }

    if (this.gameplayActive) {
      console.log("[Poki SDK] gameplayStop");
      this.sdk.gameplayStop();
      this.gameplayActive = false;
    }
  }

  /**
   * Show a commercial break (video ad)
   * @param onBeforeAd Optional callback to execute before ad shows
   * @returns Promise that resolves when ad break is complete
   */
  async commercialBreak(onBeforeAd?: () => void): Promise<void> {
    if (!this.initialized || !this.sdk) {
      console.log("[Poki SDK] commercialBreak - SDK not ready");
      return;
    }

    console.log("[Poki SDK] commercialBreak");
    return this.sdk.commercialBreak(onBeforeAd);
  }

  /**
   * Show a rewarded break (rewarded video ad)
   * @param options Optional options object or callback
   * @param callback Optional callback when ad starts
   * @returns Promise that resolves with success boolean
   */
  async rewardedBreak(
    optionsOrCallback?:
      | (() => void)
      | {
          size?: "small" | "medium" | "large";
          onStart?: () => void;
        },
    callback?: () => void
  ): Promise<boolean> {
    if (!this.initialized || !this.sdk) {
      console.log("[Poki SDK] rewardedBreak - SDK not ready");
      return false;
    }

    console.log("[Poki SDK] rewardedBreak");
    return this.sdk.rewardedBreak(optionsOrCallback as any, callback);
  }

  /**
   * Check if SDK is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if gameplay is currently active
   */
  isGameplayActive(): boolean {
    return this.gameplayActive;
  }
}

// Export singleton instance
export const pokiSDK = PokiSDKWrapper.getInstance();

// Export individual functions for convenience
export const initPokiSDK = () => pokiSDK.init();
export const pokiGameLoadingFinished = () => pokiSDK.gameLoadingFinished();
export const pokiGameplayStart = () => pokiSDK.gameplayStart();
export const pokiGameplayStop = () => pokiSDK.gameplayStop();
export const pokiCommercialBreak = (onBeforeAd?: () => void) =>
  pokiSDK.commercialBreak(onBeforeAd);
export const pokiRewardedBreak = (
  optionsOrCallback?:
    | (() => void)
    | {
        size?: "small" | "medium" | "large";
        onStart?: () => void;
      },
  callback?: () => void
) => pokiSDK.rewardedBreak(optionsOrCallback, callback);