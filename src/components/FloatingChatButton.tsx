
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles } from 'lucide-react';
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
          className="relative w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full shadow-2xl border border-white/20 flex items-center justify-center group hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity animate-pulse" />
          
          {/* Sparkle effect */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full animate-ping" />
            <div className="absolute bottom-3 right-2 w-1 h-1 bg-white rounded-full animate-ping delay-300" />
            <div className="absolute top-1/2 right-1 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-700" />
          </div>
          
          {/* Chat icon */}
          <motion.div
            className="relative z-10"
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 0.9 : 1
            }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            {isOpen ? (
              <Sparkles className="w-7 h-7 text-white" />
            ) : (
              <MessageSquare className="w-7 h-7 text-white" />
            )}
          </motion.div>

          {/* Outer pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping opacity-75" />
          <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-pulse" />
          
          {/* Status indicator */}
          <motion.div 
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </motion.div>
        </motion.button>
      </motion.div>

      <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </>
  );
}
