
import { useEffect } from 'react';
import { deepSeekService } from '@/services/deepSeekService';

export function useErrorHandler() {
  useEffect(() => {
    // Global error handler
    const handleError = (event: ErrorEvent) => {
      deepSeekService.logError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      deepSeekService.logError({
        message: 'Unhandled Promise Rejection',
        reason: event.reason
      });
    };

    // Log page visits
    const logPageVisit = () => {
      deepSeekService.logPageVisit(window.location.pathname);
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
