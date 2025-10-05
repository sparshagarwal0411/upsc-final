interface AgentRequest {
  message: string;
  session_id: string;
}

interface AgentResponse {
  reply: string;
  session_id: string;
  user: string;
}

interface AgentError {
  error: string;
}

class AgentService {
  private baseUrl = 'https://igdt.adityaexp.dev';
  private debugMode = true; // Set to false in production

  /**
   * Send a message to the AI agent
   * @param message - The user's message
   * @param sessionId - The session ID for maintaining conversation context
   * @returns Promise with the agent's response
   */
  async sendMessage(message: string, sessionId: string): Promise<AgentResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        throw new Error('Authentication token has expired. Please log in again.');
      }
    } catch (error) {
      throw new Error('Invalid authentication token. Please log in again.');
    }

    const requestBody: AgentRequest = {
      message,
      session_id: sessionId
    };

    try {
      if (this.debugMode) {
        console.log('Sending request to agent endpoint:', {
          url: `${this.baseUrl}/agent`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.substring(0, 20) + '...' // Log only first 20 chars for security
          },
          body: requestBody
        });
      }

      const response = await fetch(`${this.baseUrl}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(requestBody)
      });

      if (this.debugMode) {
        console.log('Agent response status:', response.status);
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData: AgentError = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data: AgentResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Agent service error:', error);
      throw error;
    }
  }

  /**
   * Generate a unique session ID
   * @returns A unique session ID string
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if the user is authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

// Export a singleton instance
export const agentService = new AgentService();
export default agentService;
