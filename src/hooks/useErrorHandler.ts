
import { useEffect } from 'react';
import { deepSeekService } from '@/services/deepSeekService';

export function useErrorHandler() {
  useEffect(() => {
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      try {
        deepSeekService.logError({
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      } catch (error) {
        console.error('Failed to log error:', error);
      }
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        deepSeekService.logError({
          message: 'Unhandled Promise Rejection',
          reason: event.reason
        });
      } catch (error) {
        console.error('Failed to log promise rejection:', error);
      }
    };

    // Log page visits
    const logPageVisit = () => {
      try {
        deepSeekService.logPageVisit(window.location.pathname);
      } catch (error) {
        console.error('Failed to log page visit:', error);
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Log initial page visit
    logPageVisit();

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}
