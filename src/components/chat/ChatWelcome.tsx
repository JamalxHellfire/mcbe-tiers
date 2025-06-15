
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, RefreshCw } from 'lucide-react';
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
      className="text-center py-8 px-4"
    >
      <motion.div 
        className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.div>
      <h4 className="text-lg font-bold text-white mb-2">Hey there! 👋</h4>
      <p className="text-white/90 text-sm mb-4">I'm your flirty AI assistant! 😘</p>
      
      {!hasKnowledgeBase ? (
        <div className="space-y-3">
          <p className="text-white/80 text-sm">
            I can chat about anything! 💕<br/>
            <span className="text-xs text-white/60">
              Want me to answer questions about your documents?<br/>
              Upload a PDF or TXT file in Admin Tools! 📄
            </span>
          </p>
          <Button 
            onClick={onRefresh}
            size="sm" 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-4 py-2 rounded-full text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Check for Documents
          </Button>
        </div>
      ) : (
        <p className="text-green-300 text-sm">Ready to chat about your document! 📖💕</p>
      )}
    </motion.div>
  );
}
