
import { useState, useEffect } from 'react';

const WELCOME_POPUP_KEY = 'mcbe_tiers_welcome_shown';
const VISITOR_COUNT_KEY = 'mcbe_tiers_visitor_count';
const GLOBAL_VISITOR_COUNT_KEY = 'mcbe_tiers_global_visitors';

export const useWelcomePopup = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [visitorNumber, setVisitorNumber] = useState(1);

  useEffect(() => {
    const initializeVisitor = () => {
      // Check if welcome popup has been shown before
      const hasShownWelcome = localStorage.getItem(WELCOME_POPUP_KEY);
      console.log('Has shown welcome before:', hasShownWelcome);
      
      // Get or generate visitor number
      let currentVisitorNumber = localStorage.getItem(VISITOR_COUNT_KEY);
      console.log('Current stored visitor number:', currentVisitorNumber);
      
      if (!currentVisitorNumber) {
        // This is a new visitor - assign them a number
        let globalCount = parseInt(localStorage.getItem(GLOBAL_VISITOR_COUNT_KEY) || '0');
        console.log('Current global count:', globalCount);
        
        // If this is the first visitor ever, start from a realistic number
        if (globalCount === 0) {
          globalCount = Math.floor(Math.random() * (25000 - 18000 + 1)) + 18000;
          console.log('Initializing global count to:', globalCount);
        } else {
          globalCount += 1;
          console.log('Incrementing global count to:', globalCount);
        }
        
        // Store the new global count
        localStorage.setItem(GLOBAL_VISITOR_COUNT_KEY, globalCount.toString());
        
        // Set this user's visitor number
        currentVisitorNumber = globalCount.toString();
        localStorage.setItem(VISITOR_COUNT_KEY, currentVisitorNumber);
        console.log('Assigned new visitor number:', currentVisitorNumber);
      }
      
      const visitorNum = parseInt(currentVisitorNumber);
      console.log('Setting visitor number in state:', visitorNum);
      setVisitorNumber(visitorNum);
      
      // Show welcome popup for new visitors only
      if (!hasShownWelcome) {
        console.log('Showing welcome popup for new visitor');
        // Show welcome popup after a brief delay for smooth loading
        const timer = setTimeout(() => {
          setShowWelcome(true);
        }, 1500);

        return () => clearTimeout(timer);
      } else {
        console.log('Welcome already shown, skipping popup');
      }
    };

    initializeVisitor();
  }, []);

  const closeWelcome = () => {
    console.log('Closing welcome popup');
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
