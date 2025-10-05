import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, User, Loader2, MessageSquare, BookOpen, Lightbulb, HelpCircle, AlertCircle } from 'lucide-react';
import { agentService } from '../services/agentService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIStudyAssistancePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => agentService.generateSessionId());
  const [authError, setAuthError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hello ${user?.name || 'there'}! I'm your AI Study Assistant. I can help you with UPSC exam preparation, answer questions about various subjects, provide study tips, and assist with your learning journey. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await agentService.sendMessage(inputMessage, sessionId);
      
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        text: data.reply || 'I apologize, but I could not generate a response at this time.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if it's an authentication error
      if (error instanceof Error && (
        error.message.includes('token') || 
        error.message.includes('authentication') ||
        error.message.includes('expired') ||
        error.message.includes('invalid')
      )) {
        setAuthError('Your session has expired. Please log in again to continue using the AI Study Assistant.');
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          text: 'Authentication error: Your session has expired. Please log in again.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          text: error instanceof Error ? error.message : 'Sorry, I encountered an error while processing your request. Please try again later.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What are the main subjects in UPSC Prelims?",
    "How should I prepare for current affairs?",
    "What is the best strategy for essay writing?",
    "Can you explain the Indian Constitution?",
    "What are the important topics for Geography?",
    "How to improve answer writing skills?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleReLogin = () => {
    agentService.clearAuth();
    logout();
    navigate('/login', { state: { from: '/ai-study-assistance' } });
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Authentication Error Banner */}
      {authError && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Authentication Required
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                {authError}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleReLogin}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Log In Again
                </button>
                <button
                  onClick={clearAuthError}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Bot className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Study Assistant</h1>
            <p className="text-gray-600 dark:text-gray-300">Get personalized help with your UPSC preparation</p>
          </div>
        </div>
        
        {/* Quick Questions */}
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="mr-2 text-yellow-500" size={20} />
            Quick Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-left p-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 transition-colors text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold">Study Assistant</h2>
              <p className="text-blue-100 text-sm">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {message.isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <Bot size={16} className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Loader2 size={16} className="animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about UPSC preparation..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      {/* <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
          <BookOpen className="text-blue-600 dark:text-blue-400 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Study Resources</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Ask about NCERT books, reference materials, and study strategies for different subjects.</p>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-100 dark:to-cyan-100 rounded-xl p-6">
          <MessageSquare className="text-green-600 dark:text-green-400 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Answer Writing</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Get help with essay writing, answer structuring, and presentation techniques.</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
          <HelpCircle className="text-purple-600 dark:text-purple-400 mb-3" size={24} />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Exam Strategy</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Learn about time management, revision techniques, and exam day strategies.</p>
        </div>
      </div> */}
    </div>
  );
};

export default AIStudyAssistancePage;
