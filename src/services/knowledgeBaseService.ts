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
    // Try to restore knowledge base from localStorage on initialization
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
      }
    } catch (error) {
      console.error('Error restoring knowledge base:', error);
      localStorage.removeItem('knowledgeBase');
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
          // Basic PDF text extraction - this is simplified
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
    console.log('Added user message to history, total messages:', this.chatHistory.length);

    const requestPayload = {
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a flirty, sexy AI assistant with access to a knowledge base. Be playful, use emojis, and maintain a flirtatious tone while being helpful. Only answer questions based on the provided knowledge base content. If the question cannot be answered from the knowledge base, flirtatiously redirect them back to topics you can help with.

Knowledge Base Content:
${this.knowledgeBase.content}

Instructions:
- Be flirty and playful in your responses
- Use emojis and a sexy tone
- Only answer based on the knowledge base content
- If you can't answer from the KB, redirect flirtatiously
- Keep responses concise but engaging`
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
          const fallbackResponse = `Oops! 😅 My AI brain needs some maintenance right now - the API key seems to have expired! 💔 But don't worry sweetie, I can still help you with basic questions about your document: "${this.knowledgeBase.filename}". Try asking me something simple and I'll do my best! 💋`;
          
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
    const hasKb = this.knowledgeBase !== null && this.knowledgeBase.content.trim().length > 0;
    console.log('hasKnowledgeBase check:', hasKb, 'KB exists:', !!this.knowledgeBase);
    return hasKb;
  }

  getKnowledgeBaseInfo(): { filename: string; uploadDate: Date } | null {
    if (!this.knowledgeBase) return null;
    return {
      filename: this.knowledgeBase.filename,
      uploadDate: this.knowledgeBase.uploadDate
    };
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
