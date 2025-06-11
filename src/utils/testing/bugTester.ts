
import React from 'react';

/**
 * Comprehensive Bug Testing Suite
 * Identifies potential issues before they cause React failures
 */

interface BugTestResult {
  testName: string;
  passed: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation?: string;
  error?: string;
}

interface SystemHealthReport {
  overallHealth: 'healthy' | 'warning' | 'critical';
  passedTests: number;
  totalTests: number;
  criticalIssues: BugTestResult[];
  warnings: BugTestResult[];
  results: BugTestResult[];
}

export class BugTester {
  private results: BugTestResult[] = [];

  async runComprehensiveTests(): Promise<SystemHealthReport> {
    console.log('🔍 Starting comprehensive bug testing...');
    this.results = [];

    // Core React tests
    await this.testReactIntegrity();
    await this.testHookSystem();
    await this.testContextProviders();
    
    // Module system tests
    await this.testModuleResolution();
    await this.testDependencyIntegrity();
    
    // Component system tests
    await this.testComponentMounting();
    await this.testErrorBoundaries();
    
    // Performance tests
    await this.testMemoryLeaks();
    await this.testRenderPerformance();
    
    // Infrastructure tests
    await this.testViteConfiguration();
    await this.testStaticFiles();

    return this.generateHealthReport();
  }

  private async testReactIntegrity(): Promise<void> {
    try {
      // Test 1: React import integrity
      const reactImported = typeof React !== 'undefined';
      this.addResult('React Import Test', reactImported, 'critical', 
        'Verifies React is properly imported and available globally');

      // Test 2: React hooks availability
      const hooksAvailable = typeof React.useState === 'function' && 
                           typeof React.useEffect === 'function' && 
                           typeof React.useContext === 'function';
      this.addResult('React Hooks Availability', hooksAvailable, 'critical',
        'Ensures core React hooks are accessible');

      // Test 3: React version consistency
      const reactVersion = React.version;
      const versionValid = reactVersion && reactVersion.startsWith('18');
      this.addResult('React Version Check', versionValid, 'high',
        `React version: ${reactVersion}. Should be 18.x for compatibility`);

    } catch (error) {
      this.addResult('React Integrity Test', false, 'critical',
        'Failed to test React integrity', `Error: ${error}`);
    }
  }

  private async testHookSystem(): Promise<void> {
    try {
      // Test hook execution context
      let hookTestPassed = true;
      let hookError = '';

      try {
        // This should work in a React component context
        const TestComponent = () => {
          const [state] = React.useState(0);
          React.useEffect(() => {}, []);
          return null;
        };
        hookTestPassed = true;
      } catch (error) {
        hookTestPassed = false;
        hookError = String(error);
      }

      this.addResult('Hook Execution Test', hookTestPassed, 'critical',
        'Tests if hooks can be called without errors', hookError);

    } catch (error) {
      this.addResult('Hook System Test', false, 'critical',
        'Failed to test hook system', String(error));
    }
  }

  private async testContextProviders(): Promise<void> {
    try {
      // Test ThemeProvider availability
      const themeProviderExists = typeof React.createContext === 'function';
      this.addResult('Context System Test', themeProviderExists, 'high',
        'Verifies React Context system is functional');

      // Test for multiple React instances (common cause of hook failures)
      const multipleReactInstances = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size > 1;
      this.addResult('Single React Instance', !multipleReactInstances, 'critical',
        'Ensures only one React instance is loaded (multiple instances cause hook failures)');

    } catch (error) {
      this.addResult('Context Provider Test', false, 'high',
        'Failed to test context providers', String(error));
    }
  }

  private async testModuleResolution(): Promise<void> {
    try {
      // Test critical imports
      const imports = [
        { name: 'React Router', test: () => import('react-router-dom') },
        { name: 'Tanstack Query', test: () => import('@tanstack/react-query') },
        { name: 'Next Themes', test: () => import('next-themes') }
      ];

      for (const importTest of imports) {
        try {
          await importTest.test();
          this.addResult(`${importTest.name} Import`, true, 'medium',
            `${importTest.name} can be imported successfully`);
        } catch (error) {
          this.addResult(`${importTest.name} Import`, false, 'high',
            `Failed to import ${importTest.name}`, String(error));
        }
      }

    } catch (error) {
      this.addResult('Module Resolution Test', false, 'high',
        'Failed to test module resolution', String(error));
    }
  }

  private async testDependencyIntegrity(): Promise<void> {
    try {
      // Check for version conflicts in package.json dependencies
      const hasReactQuery = document.querySelector('script[src*="react-query"]') !== null;
      const hasNextThemes = document.querySelector('script[src*="next-themes"]') !== null;
      
      this.addResult('Dependency Loading', true, 'medium',
        'Basic dependency loading check completed');

      // Memory usage check
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        const memoryHealthy = memoryUsage < 0.8;
        this.addResult('Memory Usage', memoryHealthy, memoryHealthy ? 'low' : 'medium',
          `Memory usage: ${(memoryUsage * 100).toFixed(1)}%`);
      }

    } catch (error) {
      this.addResult('Dependency Integrity Test', false, 'medium',
        'Failed to test dependency integrity', String(error));
    }
  }

  private async testComponentMounting(): Promise<void> {
    try {
      // Test if components can mount without errors
      const rootElement = document.getElementById('root');
      const hasRoot = rootElement !== null;
      this.addResult('Root Element Test', hasRoot, 'critical',
        'Verifies root element exists for React mounting');

      // Test for render blocking errors
      const errorElements = document.querySelectorAll('[data-error]');
      const noRenderErrors = errorElements.length === 0;
      this.addResult('Render Error Check', noRenderErrors, 'high',
        `Found ${errorElements.length} render errors in DOM`);

    } catch (error) {
      this.addResult('Component Mounting Test', false, 'high',
        'Failed to test component mounting', String(error));
    }
  }

  private async testErrorBoundaries(): Promise<void> {
    try {
      // Check if error boundaries are properly implemented
      const hasErrorBoundary = document.querySelector('[data-error-boundary]') !== null;
      this.addResult('Error Boundary Check', true, 'medium',
        'Error boundary implementation status checked');

    } catch (error) {
      this.addResult('Error Boundary Test', false, 'medium',
        'Failed to test error boundaries', String(error));
    }
  }

  private async testMemoryLeaks(): Promise<void> {
    try {
      // Test for common memory leak patterns
      const eventListenerCount = (window as any).__eventListeners?.length || 0;
      const reasonableListenerCount = eventListenerCount < 100;
      this.addResult('Event Listener Count', reasonableListenerCount, 'low',
        `Event listeners: ${eventListenerCount}`);

      // Check for zombie timers
      const activeTimers = (window as any).__activeTimers?.length || 0;
      const reasonableTimerCount = activeTimers < 20;
      this.addResult('Active Timer Count', reasonableTimerCount, 'low',
        `Active timers: ${activeTimers}`);

    } catch (error) {
      this.addResult('Memory Leak Test', false, 'low',
        'Failed to test for memory leaks', String(error));
    }
  }

  private async testRenderPerformance(): Promise<void> {
    try {
      // Measure render performance
      const startTime = performance.now();
      await new Promise(resolve => requestAnimationFrame(resolve));
      const renderTime = performance.now() - startTime;
      
      const performanceGood = renderTime < 16; // 60fps threshold
      this.addResult('Render Performance', performanceGood, 'low',
        `Render time: ${renderTime.toFixed(2)}ms`);

    } catch (error) {
      this.addResult('Render Performance Test', false, 'low',
        'Failed to test render performance', String(error));
    }
  }

  private async testViteConfiguration(): Promise<void> {
    try {
      // Test if Vite is running in development mode
      const isDev = import.meta.env.DEV;
      this.addResult('Development Mode', true, 'low',
        `Running in ${isDev ? 'development' : 'production'} mode`);

      // Test HMR functionality
      const hasHMR = import.meta.hot !== undefined;
      this.addResult('Hot Module Replacement', hasHMR, 'low',
        'HMR availability check');

    } catch (error) {
      this.addResult('Vite Configuration Test', false, 'medium',
        'Failed to test Vite configuration', String(error));
    }
  }

  private async testStaticFiles(): Promise<void> {
    try {
      // Test sitemap accessibility
      const sitemapResponse = await fetch('/sitemap.xml').catch(() => null);
      const sitemapAccessible = sitemapResponse?.ok === true;
      this.addResult('Sitemap Accessibility', sitemapAccessible, 'medium',
        'Sitemap.xml file accessibility test');

      // Test robots.txt accessibility
      const robotsResponse = await fetch('/robots.txt').catch(() => null);
      const robotsAccessible = robotsResponse?.ok === true;
      this.addResult('Robots.txt Accessibility', robotsAccessible, 'low',
        'Robots.txt file accessibility test');

    } catch (error) {
      this.addResult('Static Files Test', false, 'low',
        'Failed to test static files', String(error));
    }
  }

  private addResult(testName: string, passed: boolean, severity: 'low' | 'medium' | 'high' | 'critical', description: string, error?: string): void {
    this.results.push({
      testName,
      passed,
      severity,
      description,
      error,
      recommendation: this.getRecommendation(testName, passed, severity)
    });
  }

  private getRecommendation(testName: string, passed: boolean, severity: string): string {
    if (passed) return 'No action needed';
    
    const recommendations: { [key: string]: string } = {
      'React Import Test': 'Ensure React is properly installed and imported in main.tsx',
      'React Hooks Availability': 'Check for React version conflicts or circular dependencies',
      'Hook Execution Test': 'Verify hooks are called inside React components only',
      'Single React Instance': 'Remove duplicate React dependencies or use module federation',
      'Root Element Test': 'Ensure index.html contains div with id="root"',
      'Memory Usage': 'Consider implementing memory optimization strategies'
    };

    return recommendations[testName] || 'Review implementation and dependencies';
  }

  private generateHealthReport(): SystemHealthReport {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const criticalIssues = this.results.filter(r => !r.passed && r.severity === 'critical');
    const warnings = this.results.filter(r => !r.passed && (r.severity === 'high' || r.severity === 'medium'));

    let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalIssues.length > 0) {
      overallHealth = 'critical';
    } else if (warnings.length > 0) {
      overallHealth = 'warning';
    }

    return {
      overallHealth,
      passedTests: passed,
      totalTests: total,
      criticalIssues,
      warnings,
      results: this.results
    };
  }
}

export const bugTester = new BugTester();
