
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatWelcomeProps {
  hasKnowledgeBase: boolean;
  onRefresh: () => void;
}

export function ChatWelcome({ hasKnowledgeBase, onRefresh }: ChatWelcomeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-6 px-4"
    >
      <motion.div 
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {hasKnowledgeBase ? (
          <Sparkles className="w-8 h-8 text-white" />
        ) : (
          <Bot className="w-8 h-8 text-white" />
        )}
      </motion.div>
      
      <h4 className="text-xl font-bold text-white mb-3">Welcome to MCBE TIERS! 👋</h4>
      
      {hasKnowledgeBase ? (
        <div className="space-y-3">
          <p className="text-green-300 text-sm">✨ Enhanced mode active! I have access to your document and can provide detailed information.</p>
          <p className="text-white/90 text-sm">Ask me anything about MCBE TIERS! 😘</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-white/90 text-sm mb-3">I'm ready to chat about MCBE TIERS! 🎮</p>
            <div className="text-xs text-white/80 space-y-1">
              <p>• Ask about tier systems & rankings</p>
              <p>• General gaming questions</p>
              <p>• How MCBE TIERS works</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-400/30">
            <p className="text-blue-300 text-xs mb-2">💡 For detailed player stats:</p>
            <p className="text-blue-200 text-xs">Upload a document in Admin Tools!</p>
          </div>
          
          <Button 
            onClick={onRefresh}
            size="sm" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-4 py-2 rounded-full text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Check for Documents
          </Button>
        </div>
      )}
    </motion.div>
  );
}
