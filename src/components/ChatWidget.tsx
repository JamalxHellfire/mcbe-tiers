
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, FileText, Bot, AlertCircle, RefreshCw, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear conversation when user leaves the site
  useEffect(() => {
    const handleBeforeUnload = () => {
      knowledgeBaseService.clearConversation();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 right-6 w-[420px] h-[600px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset'
            }}
          >
            {/* Gradient Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="relative"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <motion.div 
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${hasKnowledgeBase ? 'bg-green-400' : 'bg-red-400'} shadow-lg`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold text-xl">AI Assistant</h3>
                    <p className="text-white/90 text-sm">
                      {hasKnowledgeBase ? 'Ready to help ✨' : 'Upload document first 📄'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={refreshKnowledgeBaseStatus}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full transition-all duration-300 hover:scale-110"
                    title="Refresh status"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={onToggle}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Knowledge Base Status - Fixed */}
            {hasKnowledgeBase && kbInfo && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm px-6 py-4 text-sm text-white flex items-center justify-between border-b border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/30 rounded-lg">
                    <FileText className="w-4 h-4 text-green-200" />
                  </div>
                  <div>
                    <span className="font-semibold text-green-100">{kbInfo.filename}</span>
                    <p className="text-xs text-green-200/80">Document loaded and ready</p>
                  </div>
                </div>
                <div className="text-xs text-green-200/60">
                  {new Date(kbInfo.uploadDate).toLocaleDateString()}
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-red-500/20 backdrop-blur-sm px-6 py-4 text-sm text-red-200 flex items-center space-x-3 border-b border-red-500/30"
              >
                <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Chat Messages with Scrolling */}
            <div className="relative flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-6">
                <div className="space-y-6">
                  {messages.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <motion.div 
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Bot className="w-10 h-10 text-white" />
                      </motion.div>
                      <h4 className="text-xl font-bold text-white mb-3">Welcome! 👋</h4>
                      {!hasKnowledgeBase ? (
                        <div className="space-y-4">
                          <p className="text-red-300 text-sm">📄 Upload a PDF or TXT file in Admin Tools to get started!</p>
                          <Button 
                            onClick={refreshKnowledgeBaseStatus}
                            size="sm" 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-6 py-2 rounded-full font-semibold"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Check Again
                          </Button>
                        </div>
                      ) : (
                        <p className="text-green-300 text-sm">✨ Ready to chat about your document!</p>
                      )}
                    </motion.div>
                  )}
                  
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-r from-gray-600 to-gray-700'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-2xl text-sm shadow-lg backdrop-blur-sm ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-white/10 text-white border border-white/20'
                          }`}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                          <div className="text-xs opacity-70 mt-3 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
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
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-sm">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="relative p-6 bg-black/20 backdrop-blur-sm border-t border-white/10">
              <div className="flex space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={hasKnowledgeBase ? "Ask me anything... ✨" : "Upload a document first..."}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading || !hasKnowledgeBase}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || !hasKnowledgeBase}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-2xl px-6 py-3 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {!hasKnowledgeBase && (
                <p className="text-xs text-white/60 mt-3 text-center">💡 Upload a document in Admin Tools to start chatting</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
