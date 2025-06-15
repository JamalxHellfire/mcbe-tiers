
import { useState, useEffect } from 'react';

const WELCOME_POPUP_KEY = 'mcbe_tiers_welcome_shown';
const VISITOR_COUNT_KEY = 'mcbe_tiers_visitor_count';

export const useWelcomePopup = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [visitorNumber, setVisitorNumber] = useState(1);

  useEffect(() => {
    // Check if welcome popup has been shown before
    const hasShownWelcome = localStorage.getItem(WELCOME_POPUP_KEY);
    
    if (!hasShownWelcome) {
      // Get or generate visitor number
      let currentVisitorCount = localStorage.getItem(VISITOR_COUNT_KEY);
      
      if (!currentVisitorCount) {
        // Generate a random visitor number between 10000 and 99999 for new visitors
        const randomVisitorNumber = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        currentVisitorCount = randomVisitorNumber.toString();
        localStorage.setItem(VISITOR_COUNT_KEY, currentVisitorCount);
      }
      
      setVisitorNumber(parseInt(currentVisitorCount));
      
      // Show welcome popup after a brief delay for smooth loading
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    // Mark as shown so it never appears again on this device
    localStorage.setItem(WELCOME_POPUP_KEY, 'true');
  };

  return {
    showWelcome,
    visitorNumber,
    closeWelcome
  };
};
