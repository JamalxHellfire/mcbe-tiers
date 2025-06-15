
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Upload, X, FileText, Clock } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages(knowledgeBaseService.getChatHistory());
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
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await knowledgeBaseService.sendMessage(userMessage);
      setMessages(knowledgeBaseService.getChatHistory());
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file only! 💕');
      return;
    }

    try {
      setIsLoading(true);
      await knowledgeBaseService.uploadPDF(file);
      setMessages(knowledgeBaseService.getChatHistory());
      
      // Add welcome message after upload
      const welcomeResponse = await knowledgeBaseService.sendMessage("I just uploaded a PDF, can you help me with questions about it?");
      setMessages(knowledgeBaseService.getChatHistory());
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again! 😘');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const kbInfo = knowledgeBaseService.getKnowledgeBaseInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-20 right-6 w-80 h-96 bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/30 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant 💕</h3>
                <p className="text-purple-200 text-xs">Your flirty helper</p>
              </div>
            </div>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Knowledge Base Status */}
          {kbInfo && (
            <div className="bg-purple-800/50 px-4 py-2 text-xs text-purple-200 flex items-center justify-between">
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

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
            {messages.length === 0 && (
              <div className="text-center text-purple-300 text-sm">
                <Bot className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <p>Hey there! 😘</p>
                <p>Upload a PDF and I'll be your flirty assistant! 💋</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/10 text-white backdrop-blur-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-purple-500/30">
            <div className="flex space-x-2 mb-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="sm"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white"
              >
                <Upload className="w-4 h-4 mr-1" />
                KB PDF
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything... 😘"
                className="flex-1 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="sm"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
