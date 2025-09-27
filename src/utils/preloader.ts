interface PreloadOptions {
  priority?: 'high' | 'low';
  crossorigin?: 'anonymous' | 'use-credentials';
  as?: 'script' | 'style' | 'image' | 'font' | 'fetch';
}

class ResourcePreloader {
  private preloadedResources = new Set<string>();

  // Preload a resource
  preload(href: string, options: PreloadOptions = {}) {
    if (this.preloadedResources.has(href)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    
    if (options.as) {
      link.as = options.as;
    }
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }

    // Add priority hint
    if (options.priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }

    document.head.appendChild(link);
    this.preloadedResources.add(href);

    console.log('Preloaded resource:', href);
  }

  // Preload critical CSS
  preloadCSS(href: string) {
    this.preload(href, { as: 'style', priority: 'high' });
  }

  // Preload critical JavaScript
  preloadJS(href: string) {
    this.preload(href, { as: 'script', priority: 'high' });
  }

  // Preload critical images
  preloadImage(href: string) {
    this.preload(href, { as: 'image', priority: 'high' });
  }

  // Preload fonts
  preloadFont(href: string) {
    this.preload(href, { as: 'font', crossorigin: 'anonymous', priority: 'high' });
  }

  // Preload API endpoints
  preloadAPI(href: string) {
    this.preload(href, { as: 'fetch', priority: 'low' });
  }

  // Preload route components
  preloadRoute(routePath: string) {
    // This would trigger the lazy loading of the route component
    // before the user navigates to it
    const modulePath = this.getModulePath(routePath);
    if (modulePath) {
      this.preloadJS(modulePath);
    }
  }

  // Get module path for route
  private getModulePath(routePath: string): string | null {
    const routeMap: Record<string, string> = {
      '/dashboard': '/src/pages/DashboardPage.tsx',
      '/browse': '/src/pages/BrowsePropertiesPage.tsx',
      '/my-properties': '/src/pages/MyPropertiesPage.tsx',
      '/buy-fraction': '/src/pages/BuyFractionPage.tsx',
      '/rent': '/src/pages/RentPropertyPage.tsx',
      '/loan': '/src/pages/LoanPropertyPage.tsx',
      '/dao': '/src/pages/DAODashboardPage.tsx',
      '/create-deed': '/src/pages/CreateDeedPage.tsx',
      '/upload': '/src/pages/PropertyUploadPage.tsx',
    };

    return routeMap[routePath] || null;
  }

  // Preload critical resources on app start
  preloadCriticalResources() {
    try {
      // Only preload if not already done
      if (this.preloadedResources.size > 0) {
        return;
      }

      // Preload critical fonts
      this.preloadFont('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      // Preload critical images (if any)
      // this.preloadImage('/images/logo.png');
      
      // Preload critical API endpoints
      this.preloadAPI('/api/health');
      this.preloadAPI('/api/test');
    } catch (error) {
      console.warn('Preloader error:', error);
    }
  }

  // Preload resources for next likely routes
  preloadNextRoutes(currentRoute: string) {
    const nextRoutes: Record<string, string[]> = {
      '/': ['/dashboard', '/browse'],
      '/dashboard': ['/browse', '/my-properties'],
      '/browse': ['/buy-fraction', '/dashboard'],
      '/my-properties': ['/dashboard', '/browse'],
    };

    const routes = nextRoutes[currentRoute] || [];
    routes.forEach(route => this.preloadRoute(route));
  }

  // Check if resource is already preloaded
  isPreloaded(href: string): boolean {
    return this.preloadedResources.has(href);
  }

  // Get preloaded resources count
  getPreloadedCount(): number {
    return this.preloadedResources.size;
  }
}

// Create singleton instance
export const preloader = new ResourcePreloader();

// Hook for preloading resources
export const usePreloader = () => {
  const preloadResource = (href: string, options?: PreloadOptions) => {
    preloader.preload(href, options);
  };

  const preloadRoute = (routePath: string) => {
    preloader.preloadRoute(routePath);
  };

  const preloadNextRoutes = (currentRoute: string) => {
    preloader.preloadNextRoutes(currentRoute);
  };

  return {
    preloadResource,
    preloadRoute,
    preloadNextRoutes,
    isPreloaded: preloader.isPreloaded.bind(preloader),
    getPreloadedCount: preloader.getPreloadedCount.bind(preloader)
  };
};
