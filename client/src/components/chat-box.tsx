import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { sendTextMessage } from "@/lib/api";
import type { Message } from "@/components/jarvis-ui";

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string, isUser?: boolean) => void;
  onClearChat: () => void;
  onApiResponse: (response: any) => void;
  setIsLoading: (loading: boolean) => void;
}

export function ChatBox({ 
  messages, 
  isLoading, 
  onSendMessage, 
  onClearChat, 
  onApiResponse, 
  setIsLoading 
}: ChatBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    onSendMessage(message, true);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendTextMessage(message);
      onApiResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Jarvis API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-jarvis-green rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-jarvis-green-foreground">J</span>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Jarvis Assistant</h3>
            <p className="text-xs text-muted-foreground">Online • Ready to help</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 hover:bg-muted rounded-md"
          data-testid="clear-chat"
        >
          Clear Chat
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-enter`}>
            <div className="max-w-xs lg:max-w-md">
              <div className={`${
                message.isUser 
                  ? 'bg-primary text-primary-foreground rounded-br-md' 
                  : 'bg-jarvis-green text-jarvis-green-foreground rounded-bl-md'
              } rounded-2xl px-4 py-2`}>
                <p className="text-sm">{message.text}</p>
              </div>
              <p className={`text-xs text-muted-foreground mt-1 ${message.isUser ? 'text-right' : ''}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground"
              data-testid="message-input"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="send-message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
