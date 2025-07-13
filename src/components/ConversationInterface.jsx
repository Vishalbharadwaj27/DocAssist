import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateAIResponse } from '@/utils/mockData';
import { useSlideIn } from '@/utils/animations';
import { TypingAnimation } from '@/components/TypingAnimation';

/**
 * Conversation Interface Component
 * Provides a chat interface for interacting with the DocAssist AI
 * @returns {JSX.Element} Chat interface
 */
export const ConversationInterface = () => {
  // Array of chat messages
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hello Dr. Lee, I'm DocAssist. How can I help you with patient information today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  // Current message being typed
  const [inputValue, setInputValue] = useState('');
  
  // Loading state while AI is processing
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference to scroll to bottom of messages
  const messagesEndRef = useRef(null);
  
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(100, 300, 'up');

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Scrolls the chat to the bottom to show latest messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Sends a message to the AI and handles the response
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create user message object
    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(inputValue);
      
      // Create AI response message object
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Create error message object
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't retrieve that information. Please try again or rephrase your question.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard events for sending messages
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="shadow-card" style={slideInStyle}>
      <CardContent className="p-0 flex flex-col h-[500px]">
        {/* Header with AI assistant info */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-medical-blue flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium">DocAssist AI</h3>
          </div>
          <Badge variant="outline" className="bg-medical-lightBlue text-medical-blue">Beta</Badge>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 subtle-scrollbar space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-medical-blue text-white' : 'bg-accent'} rounded-2xl px-4 py-3`}>
                {/* Message header with sender and time */}
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'ai' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === 'ai' ? 'DocAssist' : 'You'}
                  </span>
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* Message content */}
                <div className="text-sm whitespace-pre-wrap">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-accent rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="text-xs font-medium">DocAssist</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Retrieving information...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about patients, conditions, test results..."
              className="resize-none min-h-[60px]"
              disabled={isLoading}
            />
            <Button 
              className="shrink-0" 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          
          {/* Help text with suggested queries */}
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Suggested queries: "Tell me about Alex Morgan's condition" • "Which patients have diabetes?" • "Show critical patients"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Custom Badge component for the ConversationInterface
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge variant (default or outline)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Badge component
 */
const Badge = ({ children, variant, className }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium";
  const variantClasses = variant === 'outline' 
    ? "border border-input bg-background" 
    : "bg-primary text-primary-foreground";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

// PropTypes for type checking in JavaScript
Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outline']),
  className: PropTypes.string,
}; 