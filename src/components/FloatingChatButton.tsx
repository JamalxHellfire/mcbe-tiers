
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full shadow-xl border border-blue-500/20 flex items-center justify-center group hover:shadow-2xl transition-all duration-300"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-90 group-hover:opacity-100 transition-opacity" />
          
          {/* Chat icon */}
          <motion.div
            className="relative z-10"
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 0.9 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <HelpCircle className="w-6 h-6 text-white" />
            ) : (
              <MessageSquare className="w-6 h-6 text-white" />
            )}
          </motion.div>

          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping opacity-75" />
          
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </motion.button>
      </motion.div>

      <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </>
  );
}
