interface BundleInfo {
  name: string;
  size: number;
  gzippedSize?: number;
  dependencies: string[];
}

class BundleAnalyzer {
  private bundleInfo: BundleInfo[] = [];

  // Analyze current bundle
  analyzeBundle() {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.log('=== Bundle Analysis ===');
    console.log('Scripts:', scripts.length);
    console.log('Stylesheets:', styles.length);
    
    // Analyze script sizes
    scripts.forEach((script, index) => {
      const src = script.getAttribute('src');
      if (src) {
        console.log(`Script ${index + 1}:`, src);
      }
    });
    
    // Analyze stylesheet sizes
    styles.forEach((style, index) => {
      const href = style.getAttribute('href');
      if (href) {
        console.log(`Stylesheet ${index + 1}:`, href);
      }
    });
    
    // Analyze performance
    this.analyzePerformance();
  }

  // Analyze performance metrics
  analyzePerformance() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    console.log('=== Performance Metrics ===');
    console.log('DOM Content Loaded:', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart), 'ms');
    console.log('Load Complete:', Math.round(navigation.loadEventEnd - navigation.loadEventStart), 'ms');
    
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    if (firstPaint) {
      console.log('First Paint:', Math.round(firstPaint.startTime), 'ms');
    }
    
    if (firstContentfulPaint) {
      console.log('First Contentful Paint:', Math.round(firstContentfulPaint.startTime), 'ms');
    }
    
    // Analyze resource loading
    this.analyzeResources();
  }

  // Analyze resource loading
  analyzeResources() {
    const resources = performance.getEntriesByType('resource');
    
    console.log('=== Resource Analysis ===');
    console.log('Total Resources:', resources.length);
    
    const resourceTypes = resources.reduce((acc, resource) => {
      const type = this.getResourceType(resource.name);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Resource Types:', resourceTypes);
    
    // Find slow resources
    const slowResources = resources
      .filter(resource => resource.duration > 1000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
    
    if (slowResources.length > 0) {
      console.log('=== Slow Resources (>1s) ===');
      slowResources.forEach(resource => {
        console.log(`${resource.name}: ${Math.round(resource.duration)}ms`);
      });
    }
  }

  // Get resource type from URL
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'JavaScript';
    if (url.includes('.css')) return 'CSS';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.webp')) return 'Image';
    if (url.includes('.woff') || url.includes('.woff2') || url.includes('.ttf') || url.includes('.otf')) return 'Font';
    if (url.includes('/api/')) return 'API';
    return 'Other';
  }

  // Get memory usage
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('=== Memory Usage ===');
      console.log('Used JS Heap:', Math.round(memory.usedJSHeapSize / 1024 / 1024), 'MB');
      console.log('Total JS Heap:', Math.round(memory.totalJSHeapSize / 1024 / 1024), 'MB');
      console.log('JS Heap Limit:', Math.round(memory.jsHeapSizeLimit / 1024 / 1024), 'MB');
    }
  }

  // Get optimization suggestions
  getOptimizationSuggestions() {
    const suggestions: string[] = [];
    
    // Check for large bundles
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    if (scripts.length > 10) {
      suggestions.push('Consider code splitting - too many script tags');
    }
    
    // Check for unused CSS
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    if (styles.length > 5) {
      suggestions.push('Consider CSS optimization - too many stylesheets');
    }
    
    // Check for slow resources
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(resource => resource.duration > 1000);
    if (slowResources.length > 0) {
      suggestions.push(`Optimize ${slowResources.length} slow resources (>1s)`);
    }
    
    // Check for large images
    const images = Array.from(document.querySelectorAll('img'));
    const largeImages = images.filter(img => {
      const rect = img.getBoundingClientRect();
      return rect.width > 1920 || rect.height > 1080;
    });
    if (largeImages.length > 0) {
      suggestions.push(`Optimize ${largeImages.length} large images`);
    }
    
    return suggestions;
  }

  // Run full analysis
  runFullAnalysis() {
    console.log('🔍 Running Bundle Analysis...');
    this.analyzeBundle();
    this.getMemoryUsage();
    
    const suggestions = this.getOptimizationSuggestions();
    if (suggestions.length > 0) {
      console.log('=== Optimization Suggestions ===');
      suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
    }
    
    console.log('✅ Bundle analysis complete');
  }
}

// Create singleton instance
export const bundleAnalyzer = new BundleAnalyzer();

// Hook for bundle analysis
export const useBundleAnalyzer = () => {
  const analyzeBundle = () => {
    bundleAnalyzer.runFullAnalysis();
  };

  const getMemoryUsage = () => {
    bundleAnalyzer.getMemoryUsage();
  };

  const getSuggestions = () => {
    return bundleAnalyzer.getOptimizationSuggestions();
  };

  return {
    analyzeBundle,
    getMemoryUsage,
    getSuggestions
  };
};
