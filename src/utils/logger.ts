// Safe logging utility for production
export const logger = {
  // Only log in development mode
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  // Always log errors (needed for troubleshooting)
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  
  // Safe info logging (no sensitive data)
  info: (message: string) => {
    if (import.meta.env.DEV) {
      console.log('[INFO]', message);
    }
  }
};