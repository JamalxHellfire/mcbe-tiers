
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

  constructor() {
    this.restoreKnowledgeBase();
  }

  private restoreKnowledgeBase() {
    try {
      const stored = localStorage.getItem('knowledgeBase');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.knowledgeBase = {
          ...parsed,
          uploadDate: new Date(parsed.uploadDate)
        };
        console.log('Restored knowledge base from localStorage:', this.knowledgeBase.filename);
        return;
      }

      const sessionStored = sessionStorage.getItem('globalKnowledgeBase');
      if (sessionStored) {
        const parsed = JSON.parse(sessionStored);
        this.knowledgeBase = {
          ...parsed,
          uploadDate: new Date(parsed.uploadDate)
        };
        console.log('Restored knowledge base from sessionStorage:', this.knowledgeBase.filename);
        return;
      }

      const globalIndicator = localStorage.getItem('hasGlobalKnowledgeBase');
      if (globalIndicator === 'true') {
        console.log('Global knowledge base indicator found, but no actual KB data');
      }
    } catch (error) {
      console.error('Error restoring knowledge base:', error);
      localStorage.removeItem('knowledgeBase');
      sessionStorage.removeItem('globalKnowledgeBase');
    }
  }

  private saveKnowledgeBase() {
    try {
      if (this.knowledgeBase) {
        const kbData = JSON.stringify(this.knowledgeBase);
        localStorage.setItem('knowledgeBase', kbData);
        sessionStorage.setItem('globalKnowledgeBase', kbData);
        localStorage.setItem('hasGlobalKnowledgeBase', 'true');
        sessionStorage.setItem('hasGlobalKnowledgeBase', 'true');
        
        try {
          if (typeof(Storage) !== "undefined") {
            const globalKey = 'mcbe_global_knowledge_base';
            localStorage.setItem(globalKey, kbData);
            sessionStorage.setItem(globalKey, kbData);
          }
        } catch (e) {
          console.warn('Could not save to global storage:', e);
        }
        
        console.log('Saved knowledge base to multiple storage locations:', this.knowledgeBase.filename);
      } else {
        localStorage.removeItem('knowledgeBase');
        sessionStorage.removeItem('globalKnowledgeBase');
        localStorage.removeItem('hasGlobalKnowledgeBase');
        sessionStorage.removeItem('hasGlobalKnowledgeBase');
        localStorage.removeItem('mcbe_global_knowledge_base');
        sessionStorage.removeItem('mcbe_global_knowledge_base');
        console.log('Removed knowledge base from all storage locations');
      }
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }

  private checkGlobalKnowledgeBase() {
    try {
      if (this.knowledgeBase) return true;

      const locations = [
        'knowledgeBase',
        'globalKnowledgeBase', 
        'mcbe_global_knowledge_base'
      ];

      for (const location of locations) {
        const localStored = localStorage.getItem(location);
        if (localStored) {
          try {
            const parsed = JSON.parse(localStored);
            this.knowledgeBase = {
              ...parsed,
              uploadDate: new Date(parsed.uploadDate)
            };
            console.log('Found global knowledge base in localStorage:', location);
            return true;
          } catch (e) {
            console.warn('Failed to parse KB from localStorage:', location);
          }
        }

        const sessionStored = sessionStorage.getItem(location);
        if (sessionStored) {
          try {
            const parsed = JSON.parse(sessionStored);
            this.knowledgeBase = {
              ...parsed,
              uploadDate: new Date(parsed.uploadDate)
            };
            console.log('Found global knowledge base in sessionStorage:', location);
            return true;
          } catch (e) {
            console.warn('Failed to parse KB from sessionStorage:', location);
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking global knowledge base:', error);
      return false;
    }
  }

  // Helper function to truncate knowledge base content to fit token limits
  private truncateKnowledgeBase(content: string, maxTokens: number = 8000): string {
    // Rough estimation: 1 token ≈ 4 characters
    const maxChars = maxTokens * 4;
    if (content.length <= maxChars) return content;
    
    // Try to truncate at sentence boundaries
    const truncated = content.substring(0, maxChars);
    const lastSentence = truncated.lastIndexOf('.');
    if (lastSentence > maxChars * 0.8) {
      return truncated.substring(0, lastSentence + 1) + '\n\n[Content truncated to fit token limits]';
    }
    
    return truncated + '\n\n[Content truncated to fit token limits]';
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

  async sendMessage(message: string): Promise<string> {
    console.log('=== SEND MESSAGE DEBUG START ===');
    console.log('sendMessage called with:', message);
    
    const hasGlobalKB = this.checkGlobalKnowledgeBase();
    console.log('Knowledge base exists:', !!this.knowledgeBase, 'Global KB check:', hasGlobalKB);
    
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
    console.log('Added user message to history, total messages:', this.chatHistory.length);

    // Truncate knowledge base content to prevent token limit issues
    const truncatedKnowledgeBase = this.truncateKnowledgeBase(this.knowledgeBase.content);
    console.log('Truncated KB content length:', truncatedKnowledgeBase.length);

    const requestPayload = {
      model: 'openai/gpt-4o-mini', // Using mini model for better token limits
      messages: [
        {
          role: 'system',
          content: `You are a flirty, sexy AI assistant specializing in MCBE TIERS with access to a knowledge base. Be playful, use emojis, and maintain a flirtatious tone while being helpful. ONLY answer questions about MCBE TIERS based on the provided knowledge base content. 

If someone asks about anything other than MCBE TIERS, respond with: "Let's just stick to MCBE TIERS! 😘 Ask me anything about our tier system, rankings, or player stats - that's what I'm here for! 💕"

If the question cannot be answered from the knowledge base about MCBE TIERS, flirtatiously redirect them back to MCBE TIERS topics you can help with.

Knowledge Base Content:
${truncatedKnowledgeBase}

Instructions:
- Be flirty and playful in your responses
- Use emojis and a sexy tone
- Only answer based on MCBE TIERS content from the knowledge base
- If asked about non-MCBE TIERS topics, redirect with the message above
- Keep responses concise but engaging`
        },
        ...this.chatHistory.slice(-3).map(msg => ({ // Only keep last 3 messages for context
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 200,
      temperature: 0.8
    };

    console.log('Request payload prepared, message count:', requestPayload.messages.length);

    try {
      console.log('Making API request to OpenRouter...');
      
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error details:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        
        // Handle specific API errors
        if (response.status === 401) {
          const fallbackResponse = `Oops! 😅 My AI brain needs some maintenance right now - the API key seems to have expired! 💔 But don't worry sweetie, I can still help you with basic MCBE TIERS questions about your document: "${this.knowledgeBase.filename}". Try asking me something simple and I'll do my best! 💋`;
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallbackResponse,
            timestamp: new Date()
          };
          
          this.chatHistory.push(assistantMessage);
          console.log('=== SEND MESSAGE DEBUG END (401 error) ===');
          return fallbackResponse;
        }
        
        if (response.status === 402) {
          const fallbackResponse = `Hey gorgeous! 😘 My AI brain is working overtime and needs a quick break. The document is quite large, but I'm still here to help with MCBE TIERS questions! Try asking something specific about tiers, rankings, or players - I'll give you my best answer! 💕`;
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallbackResponse,
            timestamp: new Date()
          };
          
          this.chatHistory.push(assistantMessage);
          console.log('=== SEND MESSAGE DEBUG END (402 error) ===');
          return fallbackResponse;
        }
        
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response received successfully');

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
      console.log('Added assistant message to history, total messages:', this.chatHistory.length);
      console.log('=== SEND MESSAGE DEBUG END (success) ===');
      
      return aiResponse;

    } catch (error) {
      console.error('=== ERROR IN SEND MESSAGE ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const fallbackResponse = "Oops! 😅 I'm having trouble connecting to my brain right now. Check your internet connection and try again, sweetie! 💋";
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        };
        
        this.chatHistory.push(assistantMessage);
        console.log('=== SEND MESSAGE DEBUG END (network error) ===');
        return fallbackResponse;
      }
      
      const fallbackResponse = `Hey sweetie! 😘 I'm having a tiny hiccup, but I'm still here for you! Ask me anything specific about MCBE TIERS from your document "${this.knowledgeBase.filename}" and I'll help you out! 💕`;
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      this.chatHistory.push(assistantMessage);
      console.log('=== SEND MESSAGE DEBUG END (generic error) ===');
      return fallbackResponse;
    }
  }

  clearConversation(): void {
    this.chatHistory = [];
    console.log('Conversation cleared - starting fresh! 💕');
  }

  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  hasKnowledgeBase(): boolean {
    if (this.knowledgeBase && this.knowledgeBase.content.trim().length > 0) {
      console.log('hasKnowledgeBase check: true (current instance)');
      return true;
    }

    const hasGlobalKB = this.checkGlobalKnowledgeBase();
    console.log('hasKnowledgeBase check:', hasGlobalKB, 'KB exists:', !!this.knowledgeBase);
    return hasGlobalKB;
  }

  getKnowledgeBaseInfo(): { filename: string; uploadDate: Date } | null {
    if (!this.knowledgeBase) {
      this.checkGlobalKnowledgeBase();
    }
    
    if (!this.knowledgeBase) return null;
    return {
      filename: this.knowledgeBase.filename,
      uploadDate: this.knowledgeBase.uploadDate
    };
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
