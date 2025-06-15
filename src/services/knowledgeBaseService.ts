
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
        console.log('Saved knowledge base to storage:', this.knowledgeBase.filename);
      } else {
        localStorage.removeItem('knowledgeBase');
        sessionStorage.removeItem('globalKnowledgeBase');
        localStorage.removeItem('hasGlobalKnowledgeBase');
        sessionStorage.removeItem('hasGlobalKnowledgeBase');
        console.log('Removed knowledge base from storage');
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
        'globalKnowledgeBase'
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

  private truncateKnowledgeBase(content: string, maxTokens: number = 6000): string {
    const maxChars = maxTokens * 4;
    if (content.length <= maxChars) return content;
    
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
          resolve(text.trim());
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read TXT file'));
      reader.readAsText(file, 'utf-8');
    });
  }

  private createFallbackResponse(hasKnowledgeBase: boolean, userMessage: string): string {
    // Simple keyword-based responses for common greetings and questions
    const message = userMessage.toLowerCase();
    
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return hasKnowledgeBase 
        ? `Hey there, gorgeous! 😘 I'm ready to help you with anything about MCBE TIERS from your document "${this.knowledgeBase?.filename}"! What would you like to know? 💕`
        : `Hi sweetie! 😘 Welcome to MCBE TIERS! I'm here to chat about tier systems, rankings, and general gaming topics. What's on your mind? 💋`;
    }
    
    if (message.includes('how') && message.includes('work')) {
      return hasKnowledgeBase
        ? `Great question! 😊 I can help you understand how MCBE TIERS works based on your uploaded document. What specific aspect would you like to know about? Rankings, scoring, or something else? 💕`
        : `MCBE TIERS is a ranking system for Minecraft Bedrock Edition players! 🎮 We organize players into different tiers based on their performance. Want to know more about how rankings work? 😘`;
    }
    
    if (message.includes('tier') || message.includes('rank')) {
      return hasKnowledgeBase
        ? `I can tell you all about tiers and rankings from your document! 📊 What specifically would you like to know about the tier system? 😘`
        : `Tiers represent different skill levels in MCBE! 🏆 Players are ranked from beginner to expert levels. Each tier has its own requirements and rewards! Want to know about specific tiers? 💫`;
    }
    
    if (message.includes('help') || message.includes('what') || message.includes('?')) {
      return hasKnowledgeBase
        ? `I'm here to help with anything about MCBE TIERS! 💕 I have access to your document "${this.knowledgeBase?.filename}" and can answer questions about rankings, stats, players, or any other MCBE TIERS topics. What would you like to know? 😘`
        : `I'm here to help with all things MCBE TIERS! 💕 I can chat about tier systems, rankings, gaming strategies, or general topics. Upload a document in Admin Tools for detailed stats, or just ask me anything! 😘`;
    }
    
    // Default responses
    return hasKnowledgeBase
      ? `That's an interesting question! 😊 Based on your document "${this.knowledgeBase?.filename}", I can help you with MCBE TIERS topics. Could you be more specific about what you'd like to know? 💕`
      : `I love chatting about MCBE TIERS! 😘 While I don't have detailed stats without a document, I'm happy to discuss tier systems, gaming, or general topics. What's on your mind? 💋`;
  }

  async sendMessage(message: string): Promise<string> {
    console.log('=== SEND MESSAGE DEBUG START ===');
    console.log('sendMessage called with:', message);
    
    const hasGlobalKB = this.checkGlobalKnowledgeBase();
    console.log('Knowledge base exists:', !!this.knowledgeBase, 'Global KB check:', hasGlobalKB);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    this.chatHistory.push(userMessage);
    console.log('Added user message to history, total messages:', this.chatHistory.length);

    // Determine system content based on whether we have a knowledge base
    let systemContent = '';
    
    if (this.knowledgeBase) {
      const truncatedKnowledgeBase = this.truncateKnowledgeBase(this.knowledgeBase.content);
      console.log('Using KB mode, content length:', truncatedKnowledgeBase.length);
      
      systemContent = `You are a flirty, friendly AI assistant for MCBE TIERS with access to a knowledge base. Be playful, use emojis, and maintain a warm, helpful tone.

You can answer questions about MCBE TIERS based on the provided knowledge base content. If someone asks about topics not covered in the knowledge base, politely redirect them to MCBE TIERS topics you can help with.

Knowledge Base Content:
${truncatedKnowledgeBase}

Instructions:
- Be friendly and playful in your responses
- Use emojis and a warm tone
- Answer based on MCBE TIERS content from the knowledge base
- Keep responses concise but engaging
- If asked about non-MCBE topics, redirect kindly to MCBE TIERS`;
    } else {
      console.log('Using general chat mode');
      systemContent = `You are a friendly, helpful AI assistant for MCBE TIERS. Be warm, use emojis, and maintain a helpful tone.

You can have conversations about:
- MCBE TIERS system and rankings
- How tier systems work  
- General gaming and Minecraft topics
- Answer basic questions and have friendly chat

For specific player data or detailed tier information, let users know they can upload documents in Admin Tools for enhanced features.

Instructions:
- Be friendly and helpful in your responses
- Use emojis and a warm tone
- Have conversations about general topics
- Guide users to upload documents for detailed data
- Keep responses concise but engaging`;
    }

    const requestPayload = {
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemContent
        },
        ...this.chatHistory.slice(-4).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      max_tokens: 300,
      temperature: 0.7
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
        console.error('OpenRouter API error, using fallback response');
        const fallbackResponse = this.createFallbackResponse(!!this.knowledgeBase, message);
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        };
        
        this.chatHistory.push(assistantMessage);
        console.log('=== SEND MESSAGE DEBUG END (fallback) ===');
        return fallbackResponse;
      }

      const data = await response.json();
      console.log('API response received successfully');

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response structure, using fallback');
        const fallbackResponse = this.createFallbackResponse(!!this.knowledgeBase, message);
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        };
        
        this.chatHistory.push(assistantMessage);
        console.log('=== SEND MESSAGE DEBUG END (fallback) ===');
        return fallbackResponse;
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
      console.error('Error details:', error);
      
      const fallbackResponse = this.createFallbackResponse(!!this.knowledgeBase, message);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };
      
      this.chatHistory.push(assistantMessage);
      console.log('=== SEND MESSAGE DEBUG END (error fallback) ===');
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
