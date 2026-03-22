import { useEffect, useRef, useState } from 'react';
import { crazyGamesService } from '../../lib/crazygames';
import { useToast } from '../../hooks/use-toast';

interface BannerAdsManagerProps {
  enabled?: boolean;
  containerId?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onBannerLoad?: () => void;
  onBannerError?: (error: any) => void;
}

interface BannerSize {
  width: number;
  height: number;
  name: string;
}

/**
 * Banner Ads Manager Component
 * Manages CrazyGames banner ads with automatic refresh and error handling
 */
export default function BannerAdsManager({
  enabled = true,
  containerId = 'crazygames-banner-container',
  width = 300,
  height = 250,
  responsive = false,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  onBannerLoad,
  onBannerError
}: BannerAdsManagerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerCount, setBannerCount] = useState(0);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Available banner sizes from CrazyGames SDK
  const BANNER_SIZES: BannerSize[] = [
    { width: 728, height: 90, name: 'Leaderboard' },
    { width: 300, height: 250, name: 'Medium' },
    { width: 320, height: 50, name: 'Mobile' },
    { width: 468, height: 60, name: 'Main' },
    { width: 320, height: 100, name: 'Large Mobile' }
  ];

  // Responsive banner sizes
  const RESPONSIVE_SIZES: BannerSize[] = [
    { width: 970, height: 90, name: '970x90' },
    { width: 320, height: 50, name: '320x50' },
    { width: 160, height: 600, name: '160x600' },
    { width: 336, height: 280, name: '336x280' },
    { width: 728, height: 90, name: '728x90' },
    { width: 300, height: 600, name: '300x600' },
    { width: 468, height: 60, name: '468x60' },
    { width: 970, height: 250, name: '970x250' },
    { width: 300, height: 250, name: '300x250' },
    { width: 250, height: 250, name: '250x250' },
    { width: 120, height: 600, name: '120x600' }
  ];

  /**
   * Create banner container element
   */
  const createBannerContainer = () => {
    // Remove existing container if it exists
    const existingContainer = document.getElementById(containerId);
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new container
    const container = document.createElement('div');
    container.id = containerId;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.margin = '0 auto';
    container.style.textAlign = 'center';
    container.style.overflow = 'hidden';
    
    // Add container styling
    container.style.borderRadius = '8px';
    container.style.backgroundColor = '#1f2937';
    container.style.border = '1px solid #374151';
    container.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

    return container;
  };

  /**
   * Request banner from CrazyGames SDK
   */
  const requestBanner = async () => {
    if (!enabled || !crazyGamesService.isAvailable()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ensure container exists
      let container = document.getElementById(containerId);
      if (!container) {
        container = createBannerContainer();
        // Append to a suitable parent (you may want to customize this)
        const parent = document.querySelector('.banner-container') || document.body;
        parent.appendChild(container);
      }

      if (responsive) {
        // Request responsive banner
        await crazyGamesService.requestResponsiveBanner(containerId);
        console.log('CrazyGames: Responsive banner requested successfully');
      } else {
        // Request static banner
        await crazyGamesService.requestBanner({
          id: containerId,
          width,
          height
        });
        console.log('CrazyGames: Static banner requested successfully');
      }

      setIsLoaded(true);
      setIsLoading(false);
      setBannerCount(prev => prev + 1);
      onBannerLoad?.();
      
      toast({
        title: "Banner Loaded",
        description: responsive ? "Responsive banner loaded" : `Banner ${width}x${height} loaded`,
        duration: 2000,
      });

    } catch (error: any) {
      console.error('CrazyGames: Banner request failed:', error);
      setIsLoading(false);
      setError(error.message || 'Banner request failed');
      onBannerError?.(error);
      
      // Show error toast
      toast({
        title: "Banner Error",
        description: error.message || 'Failed to load banner',
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  /**
   * Clear banner
   */
  const clearBanner = () => {
    try {
      crazyGamesService.clearBanner(containerId);
      setIsLoaded(false);
      setError(null);
      console.log('CrazyGames: Banner cleared');
    } catch (error) {
      console.error('CrazyGames: Failed to clear banner:', error);
    }
  };

  /**
   * Clear all banners
   */
  const clearAllBanners = () => {
    try {
      crazyGamesService.clearAllBanners();
      setIsLoaded(false);
      setError(null);
      console.log('CrazyGames: All banners cleared');
    } catch (error) {
      console.error('CrazyGames: Failed to clear all banners:', error);
    }
  };

  /**
   * Start auto-refresh timer
   */
  const startRefreshTimer = () => {
    if (!autoRefresh || refreshTimerRef.current) return;

    refreshTimerRef.current = setInterval(() => {
      // Check banner refresh limits (max 120 refreshes per session)
      if (bannerCount >= 120) {
        console.warn('CrazyGames: Banner refresh limit reached (120 per session)');
        stopRefreshTimer();
        return;
      }

      // Only refresh if banner is loaded and not currently loading
      if (isLoaded && !isLoading) {
        clearBanner();
        // Wait a moment before requesting new banner
        setTimeout(requestBanner, 1000);
      }
    }, refreshInterval);
  };

  /**
   * Stop auto-refresh timer
   */
  const stopRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  /**
   * Handle visibility change
   */
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause banner refresh when page is hidden
      stopRefreshTimer();
    } else {
      // Resume banner refresh when page becomes visible
      if (autoRefresh) {
        startRefreshTimer();
      }
    }
  };

  // Initialize banner
  useEffect(() => {
    if (enabled) {
      requestBanner();
      if (autoRefresh) {
        startRefreshTimer();
      }
      
      // Add visibility change listener
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      clearBanner();
      stopRefreshTimer();
    }
  }, [enabled, responsive, width, height]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRefreshTimer();
      clearBanner();
    };
  }, []);

  // Render banner container
  return (
    <div className="banner-ads-manager">
      <div
        id={containerId}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'relative',
          display: 'inline-block',
          margin: '0 auto',
          textAlign: 'center',
          overflow: 'hidden',
          borderRadius: '12px',
          backgroundColor: '#0b1220',
          border: '1px solid #374151',
          boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(4px)',
          // Responsive adjustments
          maxWidth: '100%',
          maxHeight: '50vh'
        }}
      >
        {!isLoaded && !isLoading && !error && (
          <div className="banner-placeholder" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '12px',
            backgroundColor: '#0b1220'
          }}>
            Banner space
          </div>
        )}
        
        {isLoading && (
          <div className="banner-loading" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '12px'
          }}>
            Loading banner...
          </div>
        )}
        
        {error && (
          <div className="banner-error" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            fontSize: '12px',
            backgroundColor: '#1f1919'
          }}>
            Banner error: {error}
          </div>
        )}
      </div>

      {/* Banner status info */}
      <div className="banner-status" style={{
        marginTop: '8px',
        fontSize: '11px',
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        {responsive ? 'Responsive Banner' : `Static Banner ${width}x${height}`}
        {isLoaded && <span style={{ color: '#22c55e' }}> • Loaded</span>}
        {isLoading && <span style={{ color: '#f59e0b' }}> • Loading</span>}
        {error && <span style={{ color: '#ef4444' }}> • Error</span>}
        <br />
        <span>Refreshes: {bannerCount}/120</span>
      </div>
    </div>
  );
}

/**
 * Hook for banner management
 */
export function useBannerAds() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [bannerSizes, setBannerSizes] = useState<string[]>([]);

  useEffect(() => {
    setIsAvailable(crazyGamesService.isAvailable());
    
    // Get available banner sizes
    if (crazyGamesService.isAvailable()) {
      const sizes = [
        '728x90 (Leaderboard)',
        '300x250 (Medium)',
        '320x50 (Mobile)',
        '468x60 (Main)',
        '320x100 (Large Mobile)'
      ];
      setBannerSizes(sizes);
    }
  }, []);

  const requestBanner = async (containerId: string, width: number, height: number) => {
    if (!isAvailable) return false;
    
    try {
      await crazyGamesService.requestBanner({
        id: containerId,
        width,
        height
      });
      return true;
    } catch (error) {
      console.error('Banner request failed:', error);
      return false;
    }
  };

  const requestResponsiveBanner = async (containerId: string) => {
    if (!isAvailable) return false;
    
    try {
      await crazyGamesService.requestResponsiveBanner(containerId);
      return true;
    } catch (error) {
      console.error('Responsive banner request failed:', error);
      return false;
    }
  };

  const clearBanner = (containerId: string) => {
    try {
      crazyGamesService.clearBanner(containerId);
      return true;
    } catch (error) {
      console.error('Clear banner failed:', error);
      return false;
    }
  };

  const clearAllBanners = () => {
    try {
      crazyGamesService.clearAllBanners();
      return true;
    } catch (error) {
      console.error('Clear all banners failed:', error);
      return false;
    }
  };

  return {
    isAvailable,
    bannerSizes,
    requestBanner,
    requestResponsiveBanner,
    clearBanner,
    clearAllBanners
  };
}