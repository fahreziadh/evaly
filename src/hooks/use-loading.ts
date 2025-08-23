import { useState, useCallback, useRef, useEffect } from "react";

interface LoadingState {
  [key: string]: boolean;
}

export function useLoading(initialLoading: boolean | string[] = false) {
  const [loading, setLoading] = useState<LoadingState>(() => {
    if (typeof initialLoading === 'boolean') {
      return { default: initialLoading };
    }
    return initialLoading.reduce((acc, key) => ({ ...acc, [key]: false }), {});
  });

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  const setLoadingState = useCallback((key: string = 'default', isLoading: boolean, delay?: number) => {
    if (delay && isLoading) {
      // Delay showing loading state
      timeoutRefs.current[key] = setTimeout(() => {
        setLoading(prev => ({ ...prev, [key]: true }));
      }, delay);
    } else {
      // Clear any pending timeout
      if (timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
        delete timeoutRefs.current[key];
      }
      setLoading(prev => ({ ...prev, [key]: isLoading }));
    }
  }, []);

  const startLoading = useCallback((key: string = 'default', delay?: number) => {
    setLoadingState(key, true, delay);
  }, [setLoadingState]);

  const stopLoading = useCallback((key: string = 'default') => {
    setLoadingState(key, false);
  }, [setLoadingState]);

  const isLoading = useCallback((key: string = 'default') => {
    return Boolean(loading[key]);
  }, [loading]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  const withLoading = useCallback(async <T>(
    fn: () => Promise<T>,
    key: string = 'default',
    options?: { delay?: number; minDuration?: number }
  ): Promise<T> => {
    const { delay = 0, minDuration = 0 } = options || {};
    const startTime = Date.now();
    
    try {
      startLoading(key, delay);
      const result = await fn();
      
      // Ensure minimum duration if specified
      if (minDuration > 0) {
        const elapsed = Date.now() - startTime;
        if (elapsed < minDuration) {
          await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
        }
      }
      
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return {
    loading: loading.default || false, // For backward compatibility
    isLoading,
    isAnyLoading,
    startLoading,
    stopLoading,
    setLoadingState,
    withLoading,
    loadingStates: loading,
  };
}

// Specialized hooks for common patterns
export function useFormLoading() {
  const { isLoading, withLoading, startLoading, stopLoading } = useLoading();
  
  const submitWithLoading = useCallback(async <T>(
    submitFn: () => Promise<T>,
    options?: { minDuration?: number }
  ) => {
    return withLoading(submitFn, 'submit', options);
  }, [withLoading]);

  return {
    isSubmitting: isLoading('submit'),
    submitWithLoading,
    startSubmitting: () => startLoading('submit'),
    stopSubmitting: () => stopLoading('submit'),
  };
}

export function useAsyncButton(asyncFn: () => Promise<void>) {
  const { isLoading, withLoading } = useLoading();
  
  const handleClick = useCallback(async () => {
    await withLoading(asyncFn, 'button', { minDuration: 500 });
  }, [asyncFn, withLoading]);

  return {
    isLoading: isLoading('button'),
    handleClick,
  };
}

export function useDataLoading() {
  const { isLoading, startLoading, stopLoading, withLoading } = useLoading(['fetch', 'refresh', 'loadMore']);

  const fetchWithLoading = useCallback(async <T>(
    fetchFn: () => Promise<T>,
    type: 'fetch' | 'refresh' | 'loadMore' = 'fetch'
  ) => {
    return withLoading(fetchFn, type, { delay: type === 'fetch' ? 200 : 0 });
  }, [withLoading]);

  return {
    isFetching: isLoading('fetch'),
    isRefreshing: isLoading('refresh'),
    isLoadingMore: isLoading('loadMore'),
    fetchWithLoading,
    startFetching: () => startLoading('fetch'),
    stopFetching: () => stopLoading('fetch'),
    startRefreshing: () => startLoading('refresh'),
    stopRefreshing: () => stopLoading('refresh'),
  };
}

// Global loading state manager (for app-wide loading indicators)
class LoadingManager {
  private subscribers = new Set<(isLoading: boolean) => void>();
  private loadingOperations = new Set<string>();

  subscribe(callback: (isLoading: boolean) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    const isLoading = this.loadingOperations.size > 0;
    this.subscribers.forEach(callback => callback(isLoading));
  }

  start(operationId: string) {
    this.loadingOperations.add(operationId);
    this.notify();
  }

  stop(operationId: string) {
    this.loadingOperations.delete(operationId);
    this.notify();
  }

  isLoading() {
    return this.loadingOperations.size > 0;
  }

  async withLoading<T>(operationId: string, fn: () => Promise<T>): Promise<T> {
    try {
      this.start(operationId);
      return await fn();
    } finally {
      this.stop(operationId);
    }
  }
}

export const globalLoadingManager = new LoadingManager();

export function useGlobalLoading() {
  const [isLoading, setIsLoading] = useState(globalLoadingManager.isLoading());

  useEffect(() => {
    const unsubscribe = globalLoadingManager.subscribe(setIsLoading);
    return unsubscribe;
  }, []);

  return { isGloballyLoading: isLoading };
}