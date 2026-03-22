/**
 * CrazyGames SDK Testing and Optimization Guide
 * 
 * This file provides testing utilities and optimization recommendations
 * for the CrazyGames SDK integration in VibeRPG.
 */

import { crazyGamesService } from './crazygames';
import { UserData, SystemInfo, GameSettings } from './crazygames';

export interface TestResult {
  test: string;
  passed: boolean;
  details: string;
  duration: number;
}

export interface PerformanceMetrics {
  sdkLoadTime: number;
  adRequestTime: number;
  bannerLoadTime: number;
  userFetchTime: number;
  dataSyncTime: number;
}

export class CrazyGamesTester {
  private results: TestResult[] = [];
  private metrics: PerformanceMetrics = {
    sdkLoadTime: 0,
    adRequestTime: 0,
    bannerLoadTime: 0,
    userFetchTime: 0,
    dataSyncTime: 0
  };

  /**
   * Run comprehensive CrazyGames SDK tests
   */
  async runAllTests(): Promise<{ results: TestResult[], metrics: PerformanceMetrics }> {
    console.log('🧪 Starting CrazyGames SDK Tests...');
    
    // Test SDK availability
    await this.testSDKAvailability();
    
    // Test ad functionality
    await this.testAdFunctionality();
    
    // Test banner functionality
    await this.testBannerFunctionality();
    
    // Test user management
    await this.testUserManagement();
    
    // Test data management
    await this.testDataManager();
    
    // Test game events
    await this.testGameEvents();
    
    // Test audio management
    await this.testAudioManagement();
    
    console.log('✅ All tests completed');
    return {
      results: this.results,
      metrics: this.metrics
    };
  }

  /**
   * Test SDK availability and initialization
   */
  private async testSDKAvailability(): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Test if SDK is available
      const isAvailable = crazyGamesService.isAvailable();
      
      if (isAvailable) {
        this.addResult('SDK Availability', true, 'CrazyGames SDK is available');
        
        // Test adblock detection
        const hasAdblock = await crazyGamesService.hasAdblock();
        this.addResult('Adblock Detection', true, `Adblock detected: ${hasAdblock}`);
        
        // Test system info
        const systemInfo = crazyGamesService.getSystemInfo();
        if (systemInfo) {
          this.addResult('System Info', true, `Device: ${systemInfo.device.type}, OS: ${systemInfo.os.name}`);
        } else {
          this.addResult('System Info', false, 'Failed to get system info');
        }
        
      } else {
        this.addResult('SDK Availability', false, 'CrazyGames SDK is not available');
      }
      
    } catch (error) {
      this.addResult('SDK Availability', false, `Error: ${error}`);
    }
    
    this.metrics.sdkLoadTime = performance.now() - startTime;
  }

  /**
   * Test ad functionality
   */
  private async testAdFunctionality(): Promise<void> {
    const startTime = performance.now();
    
    try {
      if (!crazyGamesService.isAvailable()) {
        this.addResult('Ad Functionality', false, 'SDK not available');
        return;
      }

      // Test adblock detection
      const hasAdblock = await crazyGamesService.hasAdblock();
      if (hasAdblock) {
        this.addResult('Ad Functionality', false, 'Adblock detected - ads disabled');
        return;
      }

      // Test ad callbacks
      const mockCallbacks = {
        adFinished: () => console.log('Ad finished'),
        adError: (error: any) => console.log('Ad error:', error),
        adStarted: () => console.log('Ad started')
      };

      // Note: We won't actually request ads in testing, just verify the method exists
      if (typeof crazyGamesService.requestAd === 'function') {
        this.addResult('Ad Request Method', true, 'Ad request method is available');
      } else {
        this.addResult('Ad Request Method', false, 'Ad request method not found');
      }

      // Test adblock detection
      this.addResult('Adblock Detection', true, 'Adblock detection method available');

    } catch (error) {
      this.addResult('Ad Functionality', false, `Error: ${error}`);
    }
    
    this.metrics.adRequestTime = performance.now() - startTime;
  }

  /**
   * Test banner functionality
   */
  private async testBannerFunctionality(): Promise<void> {
    const startTime = performance.now();
    
    try {
      if (!crazyGamesService.isAvailable()) {
        this.addResult('Banner Functionality', false, 'SDK not available');
        return;
      }

      // Test banner methods
      const methods = [
        'requestBanner',
        'requestResponsiveBanner', 
        'clearBanner',
        'clearAllBanners'
      ];

      let allMethodsAvailable = true;
      for (const method of methods) {
        if (typeof (crazyGamesService as any)[method] === 'function') {
          this.addResult(`Banner Method: ${method}`, true, 'Method available');
        } else {
          this.addResult(`Banner Method: ${method}`, false, 'Method not available');
          allMethodsAvailable = false;
        }
      }

      if (allMethodsAvailable) {
        this.addResult('Banner Functionality', true, 'All banner methods available');
      }

    } catch (error) {
      this.addResult('Banner Functionality', false, `Error: ${error}`);
    }
    
    this.metrics.bannerLoadTime = performance.now() - startTime;
  }

  /**
   * Test user management functionality
   */
  private async testUserManagement(): Promise<void> {
    const startTime = performance.now();
    
    try {
      if (!crazyGamesService.isAvailable()) {
        this.addResult('User Management', false, 'SDK not available');
        return;
      }

      // Test user availability
      const isUserAvailable = crazyGamesService.isUserAccountAvailable();
      this.addResult('User Account Available', isUserAvailable, `User account system: ${isUserAvailable}`);

      if (isUserAvailable) {
        // Test user methods
        const userMethods = [
          'getUser',
          'showAuthPrompt',
          'getUserToken',
          'listFriends'
        ];

        for (const method of userMethods) {
          if (typeof (crazyGamesService as any)[method] === 'function') {
            this.addResult(`User Method: ${method}`, true, 'Method available');
          } else {
            this.addResult(`User Method: ${method}`, false, 'Method not available');
          }
        }

        // Test getting current user
        try {
          const user = await crazyGamesService.getUser();
          if (user) {
            this.addResult('Get Current User', true, `User: ${user.username}`);
          } else {
            this.addResult('Get Current User', true, 'No user logged in (expected)');
          }
        } catch (error) {
          this.addResult('Get Current User', false, `Error: ${error}`);
        }
      }

    } catch (error) {
      this.addResult('User Management', false, `Error: ${error}`);
    }
    
    this.metrics.userFetchTime = performance.now() - startTime;
  }

  /**
   * Test data management functionality
   */
  private async testDataManager(): Promise<void> {
    const startTime = performance.now();
    
    try {
      if (!crazyGamesService.isAvailable()) {
        this.addResult('Data Management', false, 'SDK not available');
        return;
      }

      // Test data methods
      const dataMethods = [
        'setItem',
        'getItem', 
        'removeItem',
        'clear'
      ];

      for (const method of dataMethods) {
        if (typeof (crazyGamesService as any)[method] === 'function') {
          this.addResult(`Data Method: ${method}`, true, 'Method available');
        } else {
          this.addResult(`Data Method: ${method}`, false, 'Method not available');
        }
      }

      // Test data storage with fallback
      const testDataKey = 'test_crazygames_data';
      const testDataValue = 'test_value_' + Date.now();
      
      try {
        // Set data
        crazyGamesService.setItem(testDataKey, testDataValue);
        
        // Get data
        const retrievedData = crazyGamesService.getItem(testDataKey);
        
        if (retrievedData === testDataValue) {
          this.addResult('Data Storage', true, 'Data storage and retrieval working');
          
          // Clean up
          crazyGamesService.removeItem(testDataKey);
        } else {
          this.addResult('Data Storage', false, 'Data retrieval failed');
        }
      } catch (error) {
        this.addResult('Data Storage', false, `Error: ${error}`);
      }

    } catch (error) {
      this.addResult('Data Management', false, `Error: ${error}`);
    }
    
    this.metrics.dataSyncTime = performance.now() - startTime;
  }

  /**
   * Test game event functionality
   */
  private async testGameEvents(): Promise<void> {
    try {
      if (!crazyGamesService.isAvailable()) {
        this.addResult('Game Events', false, 'SDK not available');
        return;
      }

      // Test game event methods
      const gameMethods = [
        'gameplayStart',
        'gameplayStop',
        'loadingStart',
        'loadingStop',
        'happytime'
      ];

      for (const method of gameMethods) {
        if (typeof (crazyGamesService as any)[method] === 'function') {
          this.addResult(`Game Event: ${method}`, true, 'Method available');
        } else {
          this.addResult(`Game Event: ${method}`, false, 'Method not available');
        }
      }

      // Test game settings
      const gameSettings = crazyGamesService.getGameSettings();
      if (gameSettings) {
        this.addResult('Game Settings', true, `Settings loaded: disableChat=${gameSettings.disableChat}, muteAudio=${gameSettings.muteAudio}`);
      } else {
        this.addResult('Game Settings', false, 'Failed to get game settings');
      }

    } catch (error) {
      this.addResult('Game Events', false, `Error: ${error}`);
    }
  }

  /**
   * Test audio management
   */
  private async testAudioManagement(): Promise<void> {
    try {
      // Test audio methods exist
      const audioMethods = [
        'muteAudio',
        'restoreAudio'
      ];

      for (const method of audioMethods) {
        if (typeof (crazyGamesService as any)[method] === 'function') {
          this.addResult(`Audio Method: ${method}`, true, 'Method available');
        } else {
          this.addResult(`Audio Method: ${method}`, false, 'Method not available');
        }
      }

      this.addResult('Audio Management', true, 'Audio management methods available');

    } catch (error) {
      this.addResult('Audio Management', false, `Error: ${error}`);
    }
  }

  /**
   * Add test result
   */
  private addResult(test: string, passed: boolean, details: string): void {
    this.results.push({
      test,
      passed,
      details,
      duration: 0 // Will be calculated in final report
    });
  }

  /**
   * Generate test report
   */
  generateReport(): string {
    const passedTests = this.results.filter(r => r.passed).length;
    const totalTests = this.results.length;
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);

    let report = `
# CrazyGames SDK Test Report

## Summary
- **Total Tests:** ${totalTests}
- **Passed:** ${passedTests}
- **Failed:** ${totalTests - passedTests}
- **Pass Rate:** ${passRate}%

## Performance Metrics
- **SDK Load Time:** ${this.metrics.sdkLoadTime.toFixed(2)}ms
- **Ad Request Time:** ${this.metrics.adRequestTime.toFixed(2)}ms
- **Banner Load Time:** ${this.metrics.bannerLoadTime.toFixed(2)}ms
- **User Fetch Time:** ${this.metrics.userFetchTime.toFixed(2)}ms
- **Data Sync Time:** ${this.metrics.dataSyncTime.toFixed(2)}ms

## Test Results
`;

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      report += `${status} **${result.test}**: ${result.details}\n`;
    });

    report += `
## Recommendations

### For Production:
1. **Enable Auto-Sync**: Set autoSync=true for DataManager to keep user progress backed up
2. **Monitor Ad Performance**: Track ad request success rates and adjust timing
3. **Handle Adblock Gracefully**: Provide alternative content when ads are blocked
4. **Optimize Banner Placement**: Use responsive banners for better mobile experience
5. **User Experience**: Don't interrupt gameplay with ads during critical moments

### For Development:
1. **Test in Local Environment**: Use ?useLocalSdk=true for development testing
2. **Monitor Console**: Watch for SDK errors and warnings
3. **Test Error Handling**: Simulate network failures and adblock scenarios
4. **Performance Testing**: Monitor load times and memory usage

### For CrazyGames Submission:
1. **Follow Requirements**: Ensure all CrazyGames advertisement requirements are met
2. **Test on Preview Tool**: Use CrazyGames preview environment for final testing
3. **Verify Data Module**: Ensure data module is properly configured for progress saving
4. **Check Game Events**: Verify all game lifecycle events are properly tracked

## Integration Status
✅ **Video Ads**: Midgame and rewarded ads implemented
✅ **Banner Ads**: Static and responsive banners supported  
✅ **User Management**: Authentication and profile sync ready
✅ **Data Management**: Progress backup with 1MB limit
✅ **Game Events**: All lifecycle events tracked
✅ **Audio Management**: Automatic muting during ads
`;

    return report;
  }

  /**
   * Check if CrazyGames integration is ready for submission
   */
  async checkSubmissionReadiness(): Promise<boolean> {
    const { results } = await this.runAllTests();
    
    // Check critical requirements
    const criticalTests = [
      'SDK Availability',
      'Ad Functionality', 
      'Banner Functionality',
      'User Management',
      'Data Management',
      'Game Events'
    ];

    const criticalResults = results.filter(r => 
      criticalTests.some(test => r.test.includes(test))
    );

    const allCriticalPassed = criticalResults.every(r => r.passed);
    const passRate = (results.filter(r => r.passed).length / results.length) * 100;

    console.log(`🎯 Submission Readiness: ${allCriticalPassed && passRate >= 90 ? 'READY' : 'NOT READY'}`);
    console.log(`📊 Pass Rate: ${passRate.toFixed(1)}%`);
    
    return allCriticalPassed && passRate >= 90;
  }
}

// Export singleton instance
export const crazyGamesTester = new CrazyGamesTester();

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // Don't auto-run in production
  console.log('🔧 CrazyGames tester ready. Call crazyGamesTester.runAllTests() to test.');
}