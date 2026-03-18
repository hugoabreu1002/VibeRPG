/**
 * CrazyGames SDK Utility Service
 * Provides a clean interface for interacting with the CrazyGames SDK.
 * Docs: https://developer.crazygames.com/docs/sdk/v2/
 */

export interface CrazyGamesSDK {
  ad: {
    requestAd: (type: 'midroll' | 'rewarded', callbacks: {
      adStarted?: () => void;
      adFinished?: () => void;
      adError?: (error: any) => void;
    }) => void;
  };
  game: {
    gameplayStart: () => void;
    gameplayStop: () => void;
    happyTime: () => void;
  };
  user: {
    isUserAccountAvailable: () => boolean;
    getUser: () => Promise<any>;
    showAccountLinkPrompt: () => Promise<any>;
  };
}

let sdk: CrazyGamesSDK | null = null;

export const initCrazyGamesSDK = () => {
  if (typeof window !== 'undefined' && (window as any).CrazyGames) {
    sdk = (window as any).CrazyGames.SDK;
    console.log('CrazyGames SDK initialized');
  } else {
    console.warn('CrazyGames SDK not found');
  }
};

export const getCrazyGamesSDK = (): CrazyGamesSDK | null => sdk;

export const triggerGameplayStart = () => {
  sdk?.game.gameplayStart();
};

export const triggerGameplayStop = () => {
  sdk?.game.gameplayStop();
};

export const triggerHappyTime = () => {
  sdk?.game.happyTime();
};

export const requestAd = (type: 'midroll' | 'rewarded', onStart?: () => void, onFinish?: () => void) => {
  if (!sdk) {
    onFinish?.();
    return;
  }

  sdk.ad.requestAd(type, {
    adStarted: () => {
      console.log('Ad started');
      onStart?.();
    },
    adFinished: () => {
      console.log('Ad finished');
      onFinish?.();
    },
    adError: (error) => {
      console.error('Ad error:', error);
      onFinish?.();
    }
  });
};
