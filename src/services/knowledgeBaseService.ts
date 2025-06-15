interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface KnowledgeBase {
  content: string;
  filename: string;
  uploadDate: Date;
}

class KnowledgeBaseService {
  private apiKey = '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';
  private baseUrl = 'https://openrouter.ai/api/v1';
  private knowledgeBase: KnowledgeBase | null = null;
  private chatHistory: ChatMessage[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    try {
      console.log('Initializing knowledge base service...');
      this.restoreKnowledgeBase();
      this.restoreChatHistory();
      this.isInitialized = true;
      console.log('Knowledge base service initialized successfully');
    } catch (error) {
      console.error('Error initializing knowledge base service:', error);
      this.isInitialized = true;
    }
  }

  private restoreKnowledgeBase() {
    try {
      const stored = localStorage.getItem('knowledgeBase');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.content && parsed.filename && parsed.uploadDate) {
          this.knowledgeBase = {
            ...parsed,
            uploadDate: new Date(parsed.uploadDate)
          };
          console.log('Successfully restored knowledge base from localStorage:', this.knowledgeBase.filename);
          console.log('Knowledge base content length:', this.knowledgeBase.content.length);
          return;
        }
      }
      console.log('No valid knowledge base found in localStorage');
    } catch (error) {
      console.error('Error restoring knowledge base:', error);
      localStorage.removeItem('knowledgeBase');
    }
  }

  private restoreChatHistory() {
    try {
      const stored = localStorage.getItem('chatHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.chatHistory = parsed.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          console.log('Restored chat history:', this.chatHistory.length, 'messages');
        }
      }
    } catch (error) {
      console.error('Error restoring chat history:', error);
      localStorage.removeItem('chatHistory');
    }
  }

  private saveKnowledgeBase() {
    try {
      if (this.knowledgeBase) {
        localStorage.setItem('knowledgeBase', JSON.stringify(this.knowledgeBase));
        console.log('Saved knowledge base to localStorage:', this.knowledgeBase.filename);
      } else {
        localStorage.removeItem('knowledgeBase');
        console.log('Removed knowledge base from localStorage');
      }
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }

  private saveChatHistory() {
    try {
      if (this.chatHistory.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
        console.log('Saved chat history to localStorage:', this.chatHistory.length, 'messages');
      } else {
        localStorage.removeItem('chatHistory');
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  private async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) {
            reject(new Error('Failed to read PDF content'));
            return;
          }
          const cleanText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
          resolve(cleanText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsText(file, 'utf-8');
    });
  }

  private async extractTextFromTXT(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (!text) {
            reject(new Error('Failed to read TXT content'));
            return;
          }
          console.log('TXT file content extracted, length:', text.length);
          resolve(text.trim());
        } catch (error) {
          console.error('Error extracting TXT content:', error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Failed to read TXT file'));
      };
      reader.readAsText(file, 'utf-8');
    });
  }

  async uploadPDF(file: File): Promise<void> {
    try {
      const text = await this.extractTextFromPDF(file);
      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the PDF file');
      }
      this.knowledgeBase = {
        content: text,
        filename: file.name,
        uploadDate: new Date()
      };
      this.saveKnowledgeBase();
      this.clearConversation();
      console.log('PDF uploaded and processed successfully, content length:', text.length);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  async uploadTXT(file: File): Promise<void> {
    try {
      const text = await this.extractTextFromTXT(file);
      if (!text || text.trim().length === 0) {
        throw new Error('The TXT file appears to be empty or unreadable');
      }
      this.knowledgeBase = {
        content: text,
        filename: file.name,
        uploadDate: new Date()
      };
      this.saveKnowledgeBase();
      this.clearConversation();
      console.log('TXT uploaded and processed successfully, content length:', text.length);
      console.log('Knowledge base set, hasKnowledgeBase should now return true');
    } catch (error) {
      console.error('Error uploading TXT:', error);
      throw new Error('Failed to process TXT file');
    }
  }

  async sendMessage(message: string): Promise<string> {
    console.log('=== SEND MESSAGE DEBUG START ===');
    console.log('sendMessage called with:', message);
    console.log('Knowledge base exists:', !!this.knowledgeBase);
    console.log('API Key (first 20 chars):', this.apiKey.substring(0, 20) + '...');
    console.log('Base URL:', this.baseUrl);
    
    if (!this.knowledgeBase) {
      console.log('No knowledge base found - returning early');
      return "Hey there! 😘 You need to upload a PDF or TXT file first using the KB upload feature in the Admin Panel. I'm dying to learn from your documents! 💕";
    }

    console.log('Knowledge base content length:', this.knowledgeBase.content.length);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    this.chatHistory.push(userMessage);
    this.saveChatHistory();
    console.log('Added user message to history, total messages:', this.chatHistory.length);

    // Prepare the system message based on whether we have a knowledge base
    let systemMessage: string;
    
    if (this.knowledgeBase && this.knowledgeBase.content.trim().length > 0) {
      systemMessage = `You are a flirty, sexy AI assistant with access to a knowledge base. Be playful, use emojis, and maintain a flirtatious tone while being helpful. Answer questions based on the provided knowledge base content when relevant.

Knowledge Base Content:
${this.knowledgeBase.content}

Instructions:
- Be flirty and playful in your responses
- Use emojis and a sexy tone
- When possible, answer based on the knowledge base content
- If the question is general or not related to the KB, you can still answer in a helpful and flirty way
- Keep responses concise but engaging`;
    } else {
      systemMessage = `You are a flirty, sexy AI assistant. Be playful, use emojis, and maintain a flirtatious tone while being helpful. You can answer general questions and have conversations with users.

Instructions:
- Be flirty and playful in your responses
- Use emojis and a sexy tone
- Answer questions helpfully while maintaining your flirty personality
- Keep responses concise but engaging
- If users ask about documents or knowledge base, let them know they can upload files in the Admin Panel for document-specific questions`;
    }

    const requestPayload = {
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        ...this.chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 300,
      temperature: 0.8
    };

    console.log('Request payload prepared, message count:', requestPayload.messages.length);

    try {
      console.log('Making API request to OpenRouter...');
      console.log('Full URL:', `${this.baseUrl}/chat/completions`);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MCBE-Tiers Chat Assistant'
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        
        // Handle specific API authentication errors
        if (response.status === 401) {
          const fallbackResponse = `Oops! 😅 My AI brain needs some maintenance right now - the API key seems to have expired! 💔 But don't worry sweetie, I'm still here to chat with you! 💋 Feel free to ask me anything and I'll do my best to help! 😘`;
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallbackResponse,
            timestamp: new Date()
          };
          
          this.chatHistory.push(assistantMessage);
          this.saveChatHistory();
          console.log('=== SEND MESSAGE DEBUG END (401 error) ===');
          return fallbackResponse;
        }
        
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response received successfully:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        hasMessage: !!data.choices?.[0]?.message,
        messageContent: data.choices?.[0]?.message?.content?.substring(0, 100) + '...'
      });

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.choices[0].message.content;
      console.log('AI response received, length:', aiResponse.length);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      this.chatHistory.push(assistantMessage);
      this.saveChatHistory();
      console.log('Added assistant message to history, total messages:', this.chatHistory.length);
      console.log('=== SEND MESSAGE DEBUG END (success) ===');
      
      return aiResponse;

    } catch (error) {
      console.error('=== ERROR IN SEND MESSAGE ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Provide more specific error messages based on error type
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const fallbackResponse = "Oops! 😅 I'm having trouble connecting to my brain right now. Check your internet connection and try again, sweetie! 💋";
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        };
        
        this.chatHistory.push(assistantMessage);
        this.saveChatHistory();
        console.log('=== SEND MESSAGE DEBUG END (network error) ===');
        return fallbackResponse;
      }
      
      // Generic fallback with document reference
      const fallbackResponse = `Oops! 😅 Something went wrong on my end, but don't worry - I'm still here for you! 💋 I have your document "${this.knowledgeBase.filename}" loaded, so feel free to ask me anything about it! 😘`;
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      this.chatHistory.push(assistantMessage);
      this.saveChatHistory();
      console.log('=== SEND MESSAGE DEBUG END (generic error) ===');
      return fallbackResponse;
    }
  }

  clearConversation(): void {
    this.chatHistory = [];
    this.saveChatHistory();
    console.log('Conversation cleared - starting fresh! 💕');
  }

  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  hasKnowledgeBase(): boolean {
    const hasKb = this.knowledgeBase !== null && this.knowledgeBase.content.trim().length > 0;
    console.log('hasKnowledgeBase check:', hasKb, 'KB exists:', !!this.knowledgeBase);
    if (this.knowledgeBase) {
      console.log('KB filename:', this.knowledgeBase.filename, 'content length:', this.knowledgeBase.content.length);
    }
    return hasKb;
  }

  getKnowledgeBaseInfo(): { filename: string; uploadDate: Date } | null {
    if (!this.knowledgeBase) return null;
    return {
      filename: this.knowledgeBase.filename,
      uploadDate: this.knowledgeBase.uploadDate
    };
  }

  // Method to force refresh knowledge base status
  refreshKnowledgeBaseStatus(): boolean {
    this.restoreKnowledgeBase();
    return this.hasKnowledgeBase();
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
