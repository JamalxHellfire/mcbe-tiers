
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
      this.knowledgeBase = {
        content: text,
        filename: file.name,
        uploadDate: new Date()
      };
      this.clearConversation();
      console.log('PDF uploaded and processed successfully');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  }

  private async extractTextFromPDF(file: File): Promise<string> {
    // Simple text extraction - in a real app, you'd use a proper PDF parser
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // This is a simplified approach - you might want to use pdf-parse or similar
          const text = e.target?.result as string;
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.knowledgeBase) {
      return "Hey there! 😘 You need to upload a PDF first using the KB PDF button. I'm dying to learn from your documents! 💕";
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    this.chatHistory.push(userMessage);

    try {
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

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      this.chatHistory.push(assistantMessage);
      return aiResponse;

    } catch (error) {
      console.error('Error sending message:', error);
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
    return this.knowledgeBase !== null;
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
