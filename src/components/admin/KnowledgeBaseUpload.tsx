
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Shield, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { knowledgeBaseService } from '@/services/knowledgeBaseService';
import { useToast } from '@/hooks/use-toast';

export function KnowledgeBaseUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Check if it's a PDF file
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    console.log('PDF file detected, showing password modal');
    setPendingFile(file);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    if (!pendingFile) {
      console.log('No pending file');
      return;
    }

    console.log('Password submitted:', password);
    
    if (password !== '$$nullknox911$$') {
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive"
      });
      setPassword('');
      return;
    }

    try {
      setIsUploading(true);
      setShowPasswordModal(false);
      console.log('Uploading PDF:', pendingFile.name);
      
      await knowledgeBaseService.uploadPDF(pendingFile);
      
      toast({
        title: "Success",
        description: "PDF uploaded successfully. The AI assistant is ready to answer questions about it.",
      });
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setPassword('');
      setPendingFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelPassword = () => {
    console.log('Password modal cancelled');
    setShowPasswordModal(false);
    setPassword('');
    setPendingFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const kbInfo = knowledgeBaseService.getKnowledgeBaseInfo();

  return (
    <>
      <div className="space-y-6">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Knowledge Base Upload</h3>
          </div>
          
          <p className="text-gray-400 mb-6">
            Upload PDF documents to enhance the AI assistant's knowledge base. Only authorized personnel can upload files.
          </p>

          {kbInfo && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Currently loaded: {kbInfo.filename}</span>
              </div>
              <p className="text-green-300 text-sm mt-1">
                Uploaded on {kbInfo.uploadDate.toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full"
            >
              <Shield className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload PDF Knowledge Base'}
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancelPassword();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 w-80 border border-gray-200 dark:border-gray-700 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg">Secure Upload</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Authentication required to upload PDF</p>
              </div>
              
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code..."
                className="mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                autoFocus
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleCancelPassword}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!password.trim()}
                >
                  Authenticate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
