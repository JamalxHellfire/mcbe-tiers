
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  context?: any;
  stack?: string;
  url?: string;
  userAgent?: string;
}

interface DeepSeekAnalysis {
  reasoning: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedFix: string;
  category: string;
}

class DeepSeekService {
  private apiKey = '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';
  private baseUrl = 'https://api.deepseek.com/v1';
  private logs: LogEntry[] = [];

  async analyzeError(error: any, context?: any): Promise<DeepSeekAnalysis> {
    try {
      const errorInfo = {
        message: error.message || String(error),
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

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
              content: 'You are an expert web developer analyzing JavaScript/TypeScript errors in a React application with Supabase backend. Provide concise analysis with reasoning, severity assessment, and suggested fixes.'
            },
            {
              role: 'user',
              content: `Analyze this error and provide insights:
              
              Error: ${errorInfo.message}
              Stack: ${errorInfo.stack}
              Context: ${JSON.stringify(errorInfo.context, null, 2)}
              URL: ${errorInfo.url}
              
              Please provide:
              1. Reasoning for why this error occurred
              2. Severity level (low/medium/high/critical)
              3. Suggested fix
              4. Error category`
            }
          ],
          max_tokens: 500,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      // Parse the response to extract structured data
      return this.parseAnalysis(analysis);
    } catch (apiError) {
      console.error('DeepSeek analysis failed:', apiError);
      return {
        reasoning: 'Failed to analyze error with DeepSeek API',
        severity: 'medium',
        suggestedFix: 'Check error manually and refer to documentation',
        category: 'Unknown'
      };
    }
  }

  private parseAnalysis(analysis: string): DeepSeekAnalysis {
    // Simple parsing - in production, you might want more sophisticated parsing
    const lines = analysis.split('\n');
    
    let reasoning = 'Error analysis not available';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    let suggestedFix = 'No specific fix suggested';
    let category = 'General';

    lines.forEach(line => {
      if (line.toLowerCase().includes('reasoning') || line.includes('1.')) {
        reasoning = line.replace(/^.*?reasoning:?\s*/i, '').replace(/^1\.\s*/, '');
      }
      if (line.toLowerCase().includes('severity') || line.includes('2.')) {
        const severityMatch = line.match(/(low|medium|high|critical)/i);
        if (severityMatch) {
          severity = severityMatch[1].toLowerCase() as any;
        }
      }
      if (line.toLowerCase().includes('fix') || line.includes('3.')) {
        suggestedFix = line.replace(/^.*?fix:?\s*/i, '').replace(/^3\.\s*/, '');
      }
      if (line.toLowerCase().includes('category') || line.includes('4.')) {
        category = line.replace(/^.*?category:?\s*/i, '').replace(/^4\.\s*/, '');
      }
    });

    return { reasoning, severity, suggestedFix, category };
  }

  logError(error: any, context?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message || String(error),
      context,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.logs.push(logEntry);
    console.error('Error logged:', logEntry);

    // Analyze error with DeepSeek
    this.analyzeError(error, context).then(analysis => {
      console.log('DeepSeek Analysis:', analysis);
    });
  }

  logApiCall(method: string, endpoint: string, payload?: any, response?: any, error?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: error ? 'error' : 'info',
      message: `${method} ${endpoint}`,
      context: {
        method,
        endpoint,
        payload,
        response,
        error: error?.message
      },
      url: window.location.href
    };

    this.logs.push(logEntry);
    
    if (error) {
      this.analyzeError(error, { apiCall: { method, endpoint, payload } });
    }
  }

  logPageVisit(path: string): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Page visit: ${path}`,
      context: { path, referrer: document.referrer },
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.logs.push(logEntry);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const deepSeekService = new DeepSeekService();
