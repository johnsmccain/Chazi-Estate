import React, { useEffect, useState } from 'react';
import { bundleAnalyzer } from '../utils/bundleAnalyzer';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
    memoryUsage?: number;
    resourceCount: number;
  } | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      try {
        const loadTime = performance.now() - startTime;
        
        // Get performance metrics safely
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        
        // Get memory usage safely
        const memoryUsage = (performance as any).memory?.usedJSHeapSize 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : undefined;
        
        // Get resource count safely
        const resources = performance.getEntriesByType('resource');
        
        setMetrics({
          loadTime: Math.round(loadTime),
          domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0,
          firstPaint: Math.round(firstPaint),
          firstContentfulPaint: Math.round(firstContentfulPaint),
          memoryUsage,
          resourceCount: resources.length,
        });
      } catch (error) {
        console.warn('Performance monitoring error:', error);
      }
    };

    // Use timeout to avoid blocking
    const timer = setTimeout(() => {
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad, { once: true });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!metrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">Performance Metrics</div>
      <div>Load Time: {metrics.loadTime}ms</div>
      <div>DOM Ready: {metrics.domContentLoaded}ms</div>
      <div>First Paint: {metrics.firstPaint}ms</div>
      <div>FCP: {metrics.firstContentfulPaint}ms</div>
      {metrics.memoryUsage && <div>Memory: {metrics.memoryUsage}MB</div>}
      <div>Resources: {metrics.resourceCount}</div>
      <button 
        onClick={() => bundleAnalyzer.runFullAnalysis()}
        className="mt-2 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs"
      >
        Analyze Bundle
      </button>
    </div>
  );
};
