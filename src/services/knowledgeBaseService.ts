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
  private baseUrl = 'https://api.deepseek.com/v1';
  private knowledgeBase: KnowledgeBase | null = null;
  private chatHistory: ChatMessage[] = [];
  private sessionStartTime: Date = new Date();

  constructor() {
    this.startSessionTimer();
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

  private startSessionTimer() {
    // Clear conversation every 10 minutes
    setInterval(() => {
      this.clearConversation();
    }, 10 * 60 * 1000);
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
    console.log('sendMessage called with:', message);
    console.log('Knowledge base exists:', !!this.knowledgeBase);
    
    if (!this.knowledgeBase) {
      console.log('No knowledge base found');
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

    try {
      console.log('Making API request to DeepSeek...');
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
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
        })
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response from AI service');
      }

      const aiResponse = data.choices[0].message.content;
      console.log('AI response:', aiResponse);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      this.chatHistory.push(assistantMessage);
      console.log('Added assistant message to history, total messages:', this.chatHistory.length);
      
      return aiResponse;

    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return "Oops! 😅 I'm having trouble connecting to my brain right now. Check your internet connection and try again, sweetie! 💋";
      }
      
      return "Oops! 😅 Something went wrong on my end, but don't worry - I'm still here for you! 💋 Try asking me something else about the document you uploaded! 😘";
    }
  }

  clearConversation(): void {
    this.chatHistory = [];
    this.sessionStartTime = new Date();
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

  getTimeUntilClear(): number {
    const elapsed = Date.now() - this.sessionStartTime.getTime();
    const remaining = (10 * 60 * 1000) - elapsed;
    return Math.max(0, remaining);
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
