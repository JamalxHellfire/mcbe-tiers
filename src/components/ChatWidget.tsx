
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, FileText, Clock, Bot, AlertCircle, RefreshCw } from 'lucide-react';
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
            className="fixed bottom-20 right-6 w-80 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MessageSquare className="w-6 h-6 text-white" />
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${hasKnowledgeBase ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-blue-100 text-xs">
                    {hasKnowledgeBase ? 'Knowledge Base Ready' : 'No Knowledge Base'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={refreshKnowledgeBaseStatus}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  title="Refresh status"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onToggle}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Knowledge Base Status */}
            {kbInfo && (
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3 h-3" />
                  <span>{kbInfo.filename}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(timeUntilClear)}</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 text-xs text-red-600 dark:text-red-400 flex items-center space-x-2 border-b border-red-200 dark:border-red-800">
                <AlertCircle className="w-3 h-3" />
                <span>{error}</span>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p>Hello! I'm your AI assistant.</p>
                  {!hasKnowledgeBase ? (
                    <div className="mt-2">
                      <p className="text-red-500 mb-2">Please upload a PDF or TXT file in the Admin Panel → Admin Tools to start chatting!</p>
                      <Button 
                        onClick={refreshKnowledgeBaseStatus}
                        size="sm" 
                        variant="outline"
                        className="text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Check Again
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-2 text-green-600">Knowledge base loaded! Ask me anything about your document.</p>
                  )}
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={hasKnowledgeBase ? "Ask me anything..." : "Upload a document first..."}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading || !hasKnowledgeBase}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || !hasKnowledgeBase}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {!hasKnowledgeBase && (
                <p className="text-xs text-gray-500 mt-1">Upload a document in Admin Tools first</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
