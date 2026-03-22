/**
 * CrazyGames SDK v3 Integration Service
 * Handles all CrazyGames SDK v3 functionality for VibeRPG
 */

declare global {
  interface Window {
    CrazyGames: any;
    _crazygames: any;
  }
}

export interface CrazyGamesSDK {
  init: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  gameLoadingStart: () => void;
  gameLoadingStop: () => void;
  gameStart: () => void;
  gameStop: () => void;
  gamePause: () => void;
  gameResume: () => void;
  gameEnd: () => void;
  gameRestart: () => void;
  setScore: (score: number) => void;
  setLevel: (level: number) => void;
  setProgress: (progress: number) => void;
}

export interface GameEvents {
  onGameStart: () => void;
  onGamePause: () => void;
  onGameResume: () => void;
  onGameEnd: () => void;
  onGameRestart: () => void;
  onGameLoadingStart: () => void;
  onGameLoadingStop: () => void;
}

export interface AdCallbacks {
  adFinished: () => void;
  adError: (error: any) => void;
  adStarted: () => void;
}

export interface UserData {
  username: string;
  profilePictureUrl: string;
}

export interface SystemInfo {
  countryCode: string;
  locale: string;
  device: { type: "desktop" | "tablet" | "mobile" };
  os: { name: string; version: string };
  browser: { name: string; version: string };
  applicationType: "web" | "google_play_store" | "apple_store" | "pwa";
}

export interface GameSettings {
  disableChat: boolean;
  muteAudio: boolean;
}

export interface BannerContainer {
  id: string;
  width: number;
  height: number;
}

export interface FriendsPage {
  friends: UserData[];
  page: number;
  size: number;
  hasMore: boolean;
  total: number;
}

export interface UserTokenPayload {
  userId: string;
  gameId: string;
  username: string;
  profilePictureUrl: string;
  iat: number;
  exp: number;
}

class CrazyGamesService {
  private sdk: any = null;
  private isInitialized = false;
  private isPaused = false;
  private isGameActive = false;
  private events: GameEvents | null = null;
  private adCallbacks: AdCallbacks | null = null;
  private gameSettings: GameSettings = { disableChat: false, muteAudio: false };
  private isAudioMuted = false;
  private environment: 'crazygames' | 'local' | 'disabled' = 'disabled';

  /**
   * Initialize the CrazyGames SDK v3
   */
  async init(events: GameEvents): Promise<void> {
    this.events = events;
    
    return new Promise((resolve, reject) => {
      // Check if SDK is already loaded
      if (window.CrazyGames && window.CrazyGames.SDK) {
        this.sdk = window.CrazyGames.SDK;
        this.setupEventListeners();
        this.isInitialized = true;
        resolve();
        return;
      }

      // Wait for SDK to load
      const checkSDK = () => {
        if (window.CrazyGames && window.CrazyGames.SDK) {
          this.sdk = window.CrazyGames.SDK;
          this.setupEventListeners();
          this.isInitialized = true;
          resolve();
        } else {
          setTimeout(checkSDK, 100);
        }
      };

      checkSDK();
    });
  }

  /**
   * Setup event listeners for CrazyGames SDK v3 events
   */
  private setupEventListeners(): void {
    if (!this.sdk || !this.events) return;

    try {
      // Initialize SDK first
      this.sdk.init().then(() => {
        console.log('CrazyGames SDK v3 initialized successfully');
        
        // Get environment
        this.environment = this.sdk.environment;
        console.log('CrazyGames environment:', this.environment);

        // Game lifecycle events
        this.sdk.game.addEventListener('gamestart', () => {
          console.log('CrazyGames: Game started');
          this.isGameActive = true;
          this.events.onGameStart();
        });

        this.sdk.game.addEventListener('gamepause', () => {
          console.log('CrazyGames: Game paused');
          this.isPaused = true;
          this.events.onGamePause();
        });

        this.sdk.game.addEventListener('gameresume', () => {
          console.log('CrazyGames: Game resumed');
          this.isPaused = false;
          this.events.onGameResume();
        });

        this.sdk.game.addEventListener('gameend', () => {
          console.log('CrazyGames: Game ended');
          this.isGameActive = false;
          this.events.onGameEnd();
        });

        this.sdk.game.addEventListener('gamereplay', () => {
          console.log('CrazyGames: Game replay');
          this.events.onGameRestart();
        });

        // Loading events
        this.sdk.game.addEventListener('gameLoadingStart', () => {
          console.log('CrazyGames: Loading started');
          this.events.onGameLoadingStart();
        });

        this.sdk.game.addEventListener('gameLoadingStop', () => {
          console.log('CrazyGames: Loading stopped');
          this.events.onGameLoadingStop();
        });

        console.log('CrazyGames SDK v3 event listeners setup complete');
      }).catch((error: any) => {
        console.error('Failed to initialize CrazyGames SDK v3:', error);
      });
    } catch (error) {
      console.error('Failed to setup CrazyGames event listeners:', error);
    }
  }

  /**
   * Report game loading start to CrazyGames
   */
  gameLoadingStart(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.loadingStart) {
      this.sdk.game.loadingStart();
    }
  }

  /**
   * Report game loading stop to CrazyGames
   */
  gameLoadingStop(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.loadingStop) {
      this.sdk.game.loadingStop();
    }
  }

  /**
   * Report game start to CrazyGames
   */
  gameStart(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.gameplayStart) {
      this.sdk.game.gameplayStart();
    }
  }

  /**
   * Report game stop to CrazyGames
   */
  gameStop(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.gameplayStop) {
      this.sdk.game.gameplayStop();
    }
  }

  /**
   * Report game pause to CrazyGames
   */
  gamePause(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.gameplayPause) {
      this.sdk.game.gameplayPause();
    }
  }

  /**
   * Report game resume to CrazyGames
   */
  gameResume(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.gameplayResume) {
      this.sdk.game.gameplayResume();
    }
  }

  /**
   * Report game end to CrazyGames
   */
  gameEnd(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.gameplayStop) {
      this.sdk.game.gameplayStop();
    }
  }

  /**
   * Report game restart to CrazyGames
   */
  gameRestart(): void {
    if (this.sdk && this.sdk.game && this.sdk.game.gameplayStart) {
      this.sdk.game.gameplayStart();
    }
  }

  /**
   * Set game score for CrazyGames leaderboard
   */
  setScore(score: number): void {
    if (this.sdk && this.sdk.game && this.sdk.game.setScore) {
      this.sdk.game.setScore(score);
    }
  }

  /**
   * Set current level for CrazyGames
   */
  setLevel(level: number): void {
    if (this.sdk && this.sdk.game && this.sdk.game.setLevel) {
      this.sdk.game.setLevel(level);
    }
  }

  /**
   * Set game progress (0-100) for CrazyGames
   */
  setProgress(progress: number): void {
    if (this.sdk && this.sdk.game && this.sdk.game.setProgress) {
      this.sdk.game.setProgress(progress);
    }
  }

  /**
   * Check if CrazyGames SDK is available
   */
  isAvailable(): boolean {
    return this.isInitialized && this.sdk !== null && this.environment !== 'disabled';
  }

  /**
   * Check if game is currently paused
   */
  isGamePaused(): boolean {
    return this.isPaused;
  }

  /**
   * Get CrazyGames SDK instance
   */
  getSDK(): any {
    return this.sdk;
  }

  /**
   * Get current environment
   */
  getEnvironment(): string {
    return this.environment;
  }

  // === AD MODULE ===

  /**
   * Request a video ad (midgame or rewarded)
   */
  async requestAd(type: 'midgame' | 'rewarded', callbacks: AdCallbacks): Promise<void> {
    if (!this.sdk || !this.sdk.ad || !this.sdk.ad.requestAd) {
      console.warn('CrazyGames Ad module not available');
      return;
    }

    this.adCallbacks = callbacks;
    
    try {
      await this.sdk.ad.requestAd(type, {
        adFinished: () => {
          this.isAudioMuted = false;
          this.restoreAudio();
          callbacks.adFinished();
        },
        adError: (error: any) => {
          this.isAudioMuted = false;
          this.restoreAudio();
          callbacks.adError(error);
        },
        adStarted: () => {
          this.isAudioMuted = true;
          this.muteAudio();
          callbacks.adStarted();
        }
      });
    } catch (error) {
      console.error('Failed to request ad:', error);
      callbacks.adError(error);
    }
  }

  /**
   * Check if user has adblocker
   */
  async hasAdblock(): Promise<boolean> {
    if (!this.sdk || !this.sdk.ad || !this.sdk.ad.hasAdblock) {
      return false;
    }
    
    try {
      const result = await this.sdk.ad.hasAdblock();
      return result;
    } catch (error) {
      console.error('Failed to check adblock:', error);
      return false;
    }
  }

  // === BANNER MODULE ===

  /**
   * Request a static banner
   */
  async requestBanner(container: BannerContainer): Promise<void> {
    if (!this.sdk || !this.sdk.banner || !this.sdk.banner.requestBanner) {
      console.warn('CrazyGames Banner module not available');
      return;
    }

    try {
      await this.sdk.banner.requestBanner(container);
    } catch (error) {
      console.error('Failed to request banner:', error);
    }
  }

  /**
   * Request a responsive banner
   */
  async requestResponsiveBanner(containerId: string): Promise<void> {
    if (!this.sdk || !this.sdk.banner || !this.sdk.banner.requestResponsiveBanner) {
      console.warn('CrazyGames Banner module not available');
      return;
    }

    try {
      await this.sdk.banner.requestResponsiveBanner(containerId);
    } catch (error) {
      console.error('Failed to request responsive banner:', error);
    }
  }

  /**
   * Clear a specific banner
   */
  clearBanner(containerId: string): void {
    if (!this.sdk || !this.sdk.banner || !this.sdk.banner.clearBanner) {
      return;
    }

    try {
      this.sdk.banner.clearBanner(containerId);
    } catch (error) {
      console.error('Failed to clear banner:', error);
    }
  }

  /**
   * Clear all banners
   */
  clearAllBanners(): void {
    if (!this.sdk || !this.sdk.banner || !this.sdk.banner.clearAllBanners) {
      return;
    }

    try {
      this.sdk.banner.clearAllBanners();
    } catch (error) {
      console.error('Failed to clear all banners:', error);
    }
  }

  // === GAME MODULE ===

  /**
   * Report gameplay start
   */
  gameplayStart(): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.gameplayStart) {
      return;
    }

    try {
      this.sdk.game.gameplayStart();
    } catch (error) {
      console.error('Failed to report gameplay start:', error);
    }
  }

  /**
   * Report gameplay stop
   */
  gameplayStop(): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.gameplayStop) {
      return;
    }

    try {
      this.sdk.game.gameplayStop();
    } catch (error) {
      console.error('Failed to report gameplay stop:', error);
    }
  }

  /**
   * Report loading start
   */
  loadingStart(): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.loadingStart) {
      return;
    }

    try {
      this.sdk.game.loadingStart();
    } catch (error) {
      console.error('Failed to report loading start:', error);
    }
  }

  /**
   * Report loading stop
   */
  loadingStop(): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.loadingStop) {
      return;
    }

    try {
      this.sdk.game.loadingStop();
    } catch (error) {
      console.error('Failed to report loading stop:', error);
    }
  }

  /**
   * Trigger happy time celebration
   */
  happytime(): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.happytime) {
      return;
    }

    try {
      this.sdk.game.happytime();
    } catch (error) {
      console.error('Failed to trigger happy time:', error);
    }
  }

  /**
   * Get game settings
   */
  getGameSettings(): GameSettings {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.settings) {
      return this.gameSettings;
    }

    try {
      this.gameSettings = this.sdk.game.settings;
      return this.gameSettings;
    } catch (error) {
      console.error('Failed to get game settings:', error);
      return this.gameSettings;
    }
  }

  /**
   * Add settings change listener
   */
  addSettingsChangeListener(listener: (settings: GameSettings) => void): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.addSettingsChangeListener) {
      return;
    }

    try {
      this.sdk.game.addSettingsChangeListener(listener);
    } catch (error) {
      console.error('Failed to add settings change listener:', error);
    }
  }

  /**
   * Remove settings change listener
   */
  removeSettingsChangeListener(listener: (settings: GameSettings) => void): void {
    if (!this.sdk || !this.sdk.game || !this.sdk.game.removeSettingsChangeListener) {
      return;
    }

    try {
      this.sdk.game.removeSettingsChangeListener(listener);
    } catch (error) {
      console.error('Failed to remove settings change listener:', error);
    }
  }

  // === USER MODULE ===

  /**
   * Check if user account is available
   */
  isUserAccountAvailable(): boolean {
    if (!this.sdk || !this.sdk.user || this.sdk.user.isUserAccountAvailable === undefined) {
      return false;
    }

    try {
      return this.sdk.user.isUserAccountAvailable;
    } catch (error) {
      console.error('Failed to check user account availability:', error);
      return false;
    }
  }

  /**
   * Get current user
   */
  async getUser(): Promise<UserData | null> {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.getUser) {
      return null;
    }

    try {
      const user = await this.sdk.user.getUser();
      return user;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Get system info
   */
  getSystemInfo(): SystemInfo | null {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.systemInfo) {
      return null;
    }

    try {
      return this.sdk.user.systemInfo;
    } catch (error) {
      console.error('Failed to get system info:', error);
      return null;
    }
  }

  /**
   * Get user friends
   */
  async listFriends(page: number = 1, size: number = 10): Promise<FriendsPage | null> {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.listFriends) {
      return null;
    }

    try {
      const friendsPage = await this.sdk.user.listFriends({ page, size });
      return friendsPage;
    } catch (error) {
      console.error('Failed to list friends:', error);
      return null;
    }
  }

  /**
   * Get user token
   */
  async getUserToken(): Promise<string | null> {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.getUserToken) {
      return null;
    }

    try {
      const token = await this.sdk.user.getUserToken();
      return token;
    } catch (error) {
      console.error('Failed to get user token:', error);
      return null;
    }
  }

  /**
   * Show auth prompt
   */
  async showAuthPrompt(): Promise<UserData | null> {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.showAuthPrompt) {
      return null;
    }

    try {
      const user = await this.sdk.user.showAuthPrompt();
      return user;
    } catch (error) {
      console.error('Failed to show auth prompt:', error);
      return null;
    }
  }

  /**
   * Add auth listener
   */
  addAuthListener(listener: (user: UserData) => void): void {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.addAuthListener) {
      return;
    }

    try {
      this.sdk.user.addAuthListener(listener);
    } catch (error) {
      console.error('Failed to add auth listener:', error);
    }
  }

  /**
   * Remove auth listener
   */
  removeAuthListener(listener: (user: UserData) => void): void {
    if (!this.sdk || !this.sdk.user || !this.sdk.user.removeAuthListener) {
      return;
    }

    try {
      this.sdk.user.removeAuthListener(listener);
    } catch (error) {
      console.error('Failed to remove auth listener:', error);
    }
  }

  // === DATA MODULE ===

  /**
   * Set data item
   */
  setItem(key: string, value: string): void {
    if (!this.sdk || !this.sdk.data || !this.sdk.data.setItem) {
      // Fallback to localStorage for guest users
      localStorage.setItem(key, value);
      return;
    }

    try {
      this.sdk.data.setItem(key, value);
    } catch (error) {
      console.error('Failed to set data item:', error);
      // Fallback to localStorage
      localStorage.setItem(key, value);
    }
  }

  /**
   * Get data item
   */
  getItem(key: string): string | null {
    if (!this.sdk || !this.sdk.data || !this.sdk.data.getItem) {
      // Fallback to localStorage for guest users
      return localStorage.getItem(key);
    }

    try {
      return this.sdk.data.getItem(key);
    } catch (error) {
      console.error('Failed to get data item:', error);
      // Fallback to localStorage
      return localStorage.getItem(key);
    }
  }

  /**
   * Remove data item
   */
  removeItem(key: string): void {
    if (!this.sdk || !this.sdk.data || !this.sdk.data.removeItem) {
      // Fallback to localStorage for guest users
      localStorage.removeItem(key);
      return;
    }

    try {
      this.sdk.data.removeItem(key);
    } catch (error) {
      console.error('Failed to remove data item:', error);
      // Fallback to localStorage
      localStorage.removeItem(key);
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    if (!this.sdk || !this.sdk.data || !this.sdk.data.clear) {
      // Fallback to localStorage for guest users
      localStorage.clear();
      return;
    }

    try {
      this.sdk.data.clear();
    } catch (error) {
      console.error('Failed to clear data:', error);
      // Fallback to localStorage
      localStorage.clear();
    }
  }

  // === AUDIO MANAGEMENT ===

  /**
   * Mute audio during ads
   */
  private muteAudio(): void {
    // Implement audio muting logic
    console.log('Audio muted for ad');
  }

  /**
   * Restore audio after ads
   */
  private restoreAudio(): void {
    // Implement audio restoration logic
    console.log('Audio restored after ad');
  }
}

// Export singleton instance
export const crazyGamesService = new CrazyGamesService();

// Export for direct use
export default CrazyGamesService;