import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  BookOpen,
  Calendar,
  MapPin,
  Library
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Paul, your ZimUni AI tutor. I can help you with academic questions, study guidance, assignments, and exam preparation. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Help with my homework",
        "Study tips for exams",
        "Explain a concept", 
        "Research guidance"
      ]
    }
  ]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickActions = [
    { icon: BookOpen, label: "Homework", action: "Help me with my homework" },
    { icon: Library, label: "Research", action: "Guide me with academic research" },
    { icon: MapPin, label: "Study Tips", action: "Give me effective study tips" },
    { icon: Calendar, label: "Exam Prep", action: "How should I prepare for exams?" }
  ];

  const streamAIResponse = async (userMessage: string): Promise<string> => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/study-assistant`;
    
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);
    
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return "I'm receiving too many requests right now. Please wait a moment and try again.";
        }
        if (response.status === 402) {
          return "AI credits are currently unavailable. Please try again later.";
        }
        throw new Error('Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (let line of lines) {
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              // Update the message in real-time
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.sender === 'bot' && last.id.startsWith('streaming-')) {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, text: assistantContent } : m
                  );
                }
                return prev;
              });
            }
          } catch {
            // Ignore incomplete JSON chunks
          }
        }
      }

      // Update chat history with assistant response
      setChatHistory(prev => [...prev, { role: 'assistant', content: assistantContent }]);
      
      return assistantContent || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('AI response error:', error);
      return "I'm having trouble connecting right now. Please check your internet connection and try again.";
    }
  };

  const generateSuggestions = (response: string): string[] => {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes("assignment") || lowerResponse.includes("homework")) {
      return ["Break down the steps", "Give me an example", "What resources should I use?"];
    } else if (lowerResponse.includes("exam") || lowerResponse.includes("study")) {
      return ["Create a study schedule", "Practice questions", "Memory techniques"];
    } else if (lowerResponse.includes("research") || lowerResponse.includes("paper")) {
      return ["How to cite sources", "Structure my paper", "Find academic sources"];
    }
    
    return ["Tell me more", "Give an example", "Related topics"];
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    // Add placeholder for streaming response
    const streamingMessage: Message = {
      id: `streaming-${Date.now()}`,
      text: '',
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, streamingMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await streamAIResponse(text);
      const suggestions = generateSuggestions(response);
      
      // Replace the streaming message with the final message
      setMessages(prev => {
        const filtered = prev.filter(m => !m.id.startsWith('streaming-'));
        return [...filtered, {
          id: Date.now().toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
          suggestions
        }];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      // Remove the streaming message on error
      setMessages(prev => prev.filter(m => !m.id.startsWith('streaming-')));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-elegant hover:shadow-glow transition-all duration-300 z-50"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 shadow-elegant z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer" 
        onClick={() => setIsMinimized(!isMinimized)}>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          ZimUni AI Assistant
          <Badge variant="secondary" className="text-xs">Online</Badge>
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[520px]">
          {/* Quick Actions */}
          <div className="p-4 border-b">
            <p className="text-sm text-muted-foreground mb-2">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-lg p-3 space-y-2`}>
                    <p className="text-sm">{message.text}</p>
                    
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2 bg-background/50 hover:bg-background"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about university..."
                className="flex-1"
                maxLength={500}
              />
              <Button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ChatBot;