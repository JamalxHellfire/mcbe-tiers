import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, FileText, Clock, Bot, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { knowledgeBaseService } from '@/services/knowledgeBaseService';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeUntilClear, setTimeUntilClear] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasKnowledgeBase, setHasKnowledgeBase] = useState(false);
  const [kbInfo, setKbInfo] = useState<{ filename: string; uploadDate: Date } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshKnowledgeBaseStatus = () => {
    const hasKb = knowledgeBaseService.hasKnowledgeBase();
    const info = knowledgeBaseService.getKnowledgeBaseInfo();
    setHasKnowledgeBase(hasKb);
    setKbInfo(info);
    console.log('Refreshed KB status - Has KB:', hasKb, 'Info:', info);
  };

  useEffect(() => {
    if (isOpen) {
      console.log('Chat widget opened, loading history...');
      refreshKnowledgeBaseStatus();
      const history = knowledgeBaseService.getChatHistory();
      console.log('Loaded chat history:', history.length, 'messages');
      setMessages(history);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Refresh KB status periodically when chat is open
    if (isOpen) {
      const interval = setInterval(refreshKnowledgeBaseStatus, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilClear(knowledgeBaseService.getTimeUntilClear());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) {
      console.log('Cannot send message: empty input or loading');
      return;
    }

    if (!hasKnowledgeBase) {
      setError('Please upload a document first in Admin Panel → Admin Tools');
      return;
    }

    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    console.log('Sending message:', userMessage);

    try {
      const response = await knowledgeBaseService.sendMessage(userMessage);
      console.log('Received response:', response);
      
      const updatedHistory = knowledgeBaseService.getChatHistory();
      console.log('Updated chat history:', updatedHistory.length, 'messages');
      setMessages(updatedHistory);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  console.log('Chat widget render - KB info:', kbInfo, 'Has KB:', hasKnowledgeBase);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed bottom-20 right-6 w-96 h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-600/50 z-50 overflow-hidden backdrop-blur-xl"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 animate-pulse" />
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse ${hasKnowledgeBase ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                  <p className="text-white/80 text-sm">
                    {hasKnowledgeBase ? '✨ Ready to help' : '📄 Upload document first'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={refreshKnowledgeBaseStatus}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full transition-all duration-200 hover:scale-110"
                  title="Refresh status"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onToggle}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Knowledge Base Status */}
            {kbInfo && (
              <div className="relative bg-slate-800/80 backdrop-blur-sm px-5 py-3 text-sm text-slate-300 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">{kbInfo.filename}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-700/50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span className="text-xs font-mono">{formatTime(timeUntilClear)}</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-red-500/20 backdrop-blur-sm px-5 py-3 text-sm text-red-300 flex items-center space-x-2 border-b border-red-500/30"
              >
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Chat Messages */}
            <div className="relative flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/50 backdrop-blur-sm">
              {messages.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-slate-400 py-8"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Welcome! 👋</h4>
                  {!hasKnowledgeBase ? (
                    <div className="space-y-3">
                      <p className="text-red-400 mb-3">📄 Upload a PDF or TXT file in Admin Tools to get started!</p>
                      <Button 
                        onClick={refreshKnowledgeBaseStatus}
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Check Again
                      </Button>
                    </div>
                  ) : (
                    <p className="text-green-400">✨ Ready to chat about your document!</p>
                  )}
                </motion.div>
              )}
              
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-lg backdrop-blur-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-4'
                        : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 mr-4'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl backdrop-blur-sm mr-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative p-5 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50">
              <div className="flex space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={hasKnowledgeBase ? "Ask me anything... ✨" : "Upload a document first..."}
                  className="flex-1 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading || !hasKnowledgeBase}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || !hasKnowledgeBase}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-xl px-4 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {!hasKnowledgeBase && (
                <p className="text-xs text-slate-500 mt-2">💡 Upload a document in Admin Tools to start chatting</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
