import { useEffect, useRef, useState } from 'react';
import { crazyGamesService, GameEvents } from '../../lib/crazygames';
import { useToast } from '../../hooks/use-toast';

interface CrazyGamesIntegrationProps {
  onGameStart?: () => void;
  onGamePause?: () => void;
  onGameResume?: () => void;
  onGameEnd?: () => void;
  onGameRestart?: () => void;
  onGameLoadingStart?: () => void;
  onGameLoadingStop?: () => void;
  characterLevel?: number;
  characterXP?: number;
  characterGold?: number;
  characterRank?: string;
}

/**
 * CrazyGames Integration Component
 * Handles all CrazyGames SDK v3 events and game state management
 */
export function CrazyGamesIntegration({
  onGameStart,
  onGamePause,
  onGameResume,
  onGameEnd,
  onGameRestart,
  onGameLoadingStart,
  onGameLoadingStop,
  characterLevel,
  characterXP,
  characterGold,
  characterRank
}: CrazyGamesIntegrationProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sdkEnvironment, setSdkEnvironment] = useState<string>('unknown');
  const { toast } = useToast();
  const lastReportedLevel = useRef<number>(0);
  const lastReportedScore = useRef<number>(0);

  // Game event handlers
  const gameEvents: GameEvents = {
    onGameStart: () => {
      console.log('CrazyGames Integration: Game started');
      setIsLoading(false);
      onGameStart?.();
      
      // Report initial game state
      if (characterLevel) {
        crazyGamesService.setLevel(characterLevel);
        lastReportedLevel.current = characterLevel;
      }
      
      if (characterXP || characterGold) {
        const score = calculateScore(characterXP || 0, characterGold || 0);
        crazyGamesService.setScore(score);
        lastReportedScore.current = score;
      }
      
      toast({
        title: "Game Started",
        description: `CrazyGames integration active (${sdkEnvironment})`,
        duration: 2000,
      });
    },

    onGamePause: () => {
      console.log('CrazyGames Integration: Game paused');
      onGamePause?.();
      
      toast({
        title: "Game Paused",
        description: "Game paused by CrazyGames",
        duration: 2000,
      });
    },

    onGameResume: () => {
      console.log('CrazyGames Integration: Game resumed');
      onGameResume?.();
      
      toast({
        title: "Game Resumed",
        description: "Game resumed by CrazyGames",
        duration: 2000,
      });
    },

    onGameEnd: () => {
      console.log('CrazyGames Integration: Game ended');
      onGameEnd?.();
      
      // Report final score
      if (characterXP || characterGold) {
        const score = calculateScore(characterXP || 0, characterGold || 0);
        crazyGamesService.setScore(score);
      }
      
      toast({
        title: "Game Ended",
        description: "Thanks for playing!",
        duration: 3000,
      });
    },

    onGameRestart: () => {
      console.log('CrazyGames Integration: Game restarted');
      onGameRestart?.();
      
      // Reset reported values
      lastReportedLevel.current = 0;
      lastReportedScore.current = 0;
      
      toast({
        title: "Game Restarted",
        description: "Starting new adventure!",
        duration: 2000,
      });
    },

    onGameLoadingStart: () => {
      console.log('CrazyGames Integration: Loading started');
      setIsLoading(true);
      onGameLoadingStart?.();
    },

    onGameLoadingStop: () => {
      console.log('CrazyGames Integration: Loading stopped');
      setIsLoading(false);
      onGameLoadingStop?.();
    }
  };

  // Initialize CrazyGames SDK v3
  useEffect(() => {
    const initializeCrazyGames = async () => {
      try {
        console.log('Initializing CrazyGames SDK v3...');
        
        // Wait for SDK to be available
        const checkSDK = () => {
          if (window.CrazyGames && window.CrazyGames.SDK) {
            console.log('CrazyGames SDK v3 detected');
            setSdkEnvironment(crazyGamesService.getEnvironment());
            
            // Initialize the service
            crazyGamesService.init(gameEvents).then(() => {
              setIsInitialized(true);
              console.log('CrazyGames SDK v3 initialized successfully');
              
              // Report game loading start
              crazyGamesService.gameLoadingStart();
              
              // Simulate loading delay for demonstration
              setTimeout(() => {
                crazyGamesService.gameLoadingStop();
                crazyGamesService.gameStart();
              }, 1000);
            });
          } else {
            setTimeout(checkSDK, 100);
          }
        };
        
        checkSDK();
        
      } catch (error) {
        console.error('Failed to initialize CrazyGames SDK v3:', error);
        setIsInitialized(false);
        
        // Show warning toast for development
        if (process.env.NODE_ENV === 'development') {
          toast({
            title: "CrazyGames SDK Not Detected",
            description: "Using fallback mode. SDK will be detected in CrazyGames environment.",
            duration: 5000,
            variant: "warning"
          });
        }
      }
    };

    initializeCrazyGames();
  }, []);

  // Monitor character stats and report to CrazyGames
  useEffect(() => {
    if (!isInitialized || !characterLevel || !characterXP || !characterGold) return;

    // Report level changes
    if (characterLevel !== lastReportedLevel.current) {
      crazyGamesService.setLevel(characterLevel);
      lastReportedLevel.current = characterLevel;
      console.log('CrazyGames: Reported level change to', characterLevel);
    }

    // Calculate and report score
    const currentScore = calculateScore(characterXP, characterGold);
    if (currentScore !== lastReportedScore.current) {
      crazyGamesService.setScore(currentScore);
      lastReportedScore.current = currentScore;
      console.log('CrazyGames: Reported score change to', currentScore);
    }

    // Calculate progress (0-100 based on level and XP)
    const progress = calculateProgress(characterLevel, characterXP, characterRank);
    crazyGamesService.setProgress(progress);
  }, [isInitialized, characterLevel, characterXP, characterGold, characterRank]);

  // Handle visibility change (browser tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Game is hidden, pause if active
        if (crazyGamesService.isGameActive() && !crazyGamesService.isGamePaused()) {
          crazyGamesService.gamePause();
        }
      } else {
        // Game is visible again, resume if paused
        if (crazyGamesService.isGamePaused()) {
          crazyGamesService.gameResume();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle keyboard shortcuts for pause/resume
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Pause game on Escape key
      if (event.key === 'Escape' && crazyGamesService.isGameActive()) {
        if (crazyGamesService.isGamePaused()) {
          crazyGamesService.gameResume();
        } else {
          crazyGamesService.gamePause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="crazygames-integration" style={{ display: 'none' }}>
      {isLoading && (
        <div className="crazygames-loading">
          Loading game...
        </div>
      )}
      
      {isInitialized && (
        <div className="crazygames-status">
          <span className="crazygames-sdk-status">CrazyGames SDK v3: Active</span>
          <span className="crazygames-environment">Environment: {sdkEnvironment}</span>
          <span className="crazygames-game-status">
            Status: {crazyGamesService.isGameActive() ? 'Active' : 'Inactive'}
          </span>
          {characterLevel && (
            <span className="crazygames-level">Level: {characterLevel}</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Calculate game score based on character stats
 */
function calculateScore(xp: number, gold: number): number {
  // Simple scoring formula: XP + (Gold * 10)
  return Math.floor(xp + (gold * 10));
}

/**
 * Calculate game progress percentage (0-100)
 */
function calculateProgress(level: number, xp: number, rank?: string): number {
  // Base progress from level (assuming max level 50)
  const levelProgress = Math.min(80, (level / 50) * 80);
  
  // Additional progress from XP (next level progress)
  const xpProgress = Math.min(20, (xp / 1000) * 20);
  
  // Rank bonus
  const rankBonus = getRankBonus(rank);
  
  let progress = levelProgress + xpProgress + rankBonus;
  return Math.min(100, Math.max(0, Math.floor(progress)));
}

/**
 * Get rank bonus for progress calculation
 */
function getRankBonus(rank?: string): number {
  if (!rank) return 0;
  
  const rankBonuses: Record<string, number> = {
    'S': 10,
    'A': 8,
    'B': 6,
    'C': 4,
    'D': 2,
    'E': 1,
    'F': 0
  };
  
  return rankBonuses[rank] || 0;
}

// Export as default for the index.ts file
export default CrazyGamesIntegration;
