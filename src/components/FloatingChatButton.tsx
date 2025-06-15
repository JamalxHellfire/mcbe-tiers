
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Heart } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl border-2 border-white/20 flex items-center justify-center overflow-hidden group"
          animate={{
            boxShadow: [
              "0 0 20px rgba(147, 51, 234, 0.5)",
              "0 0 30px rgba(236, 72, 153, 0.7)",
              "0 0 20px rgba(147, 51, 234, 0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-pulse opacity-50" />
          
          {/* Bot icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>

          {/* Floating hearts */}
          <motion.div
            className="absolute top-1 right-1"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-3 h-3 text-pink-300 fill-current" />
          </motion.div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full border-2 border-pink-400/30 animate-ping" />
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">💋</span>
          </div>
        </motion.button>
      </motion.div>

      <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </>
  );
}
