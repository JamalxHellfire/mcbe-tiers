
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group transition-all duration-300 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset'
          }}
        >
          {/* Animated background gradient */}
          <div 
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #db2777 100%)'
            }}
          />
          
          {/* Sparkle effects */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full opacity-80" />
            <div className="absolute bottom-3 right-2 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
            <div className="absolute top-1/2 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-90" />
            <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full opacity-70" />
          </motion.div>
          
          {/* Main icon */}
          <motion.div
            className="relative z-10"
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 0.9 : 1
            }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            {isOpen ? (
              <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
            ) : (
              <MessageSquare className="w-8 h-8 text-white drop-shadow-lg" />
            )}
          </motion.div>

          {/* Outer pulse rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Status indicator */}
          <motion.div 
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30"
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 8px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0.4)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
        </motion.button>
      </motion.div>

      <ChatWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </>
  );
}
