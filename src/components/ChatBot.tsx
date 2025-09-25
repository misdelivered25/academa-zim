import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm ZimUni AI Assistant. I can help you with university information, assignments, library resources, and campus navigation. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "Show me my assignments",
        "Find library resources",
        "Campus directions", 
        "University programs"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { icon: BookOpen, label: "Assignments", action: "Show me my current assignments" },
    { icon: Library, label: "Library", action: "Search library resources" },
    { icon: MapPin, label: "Campus Map", action: "Help me navigate campus" },
    { icon: Calendar, label: "Schedule", action: "Show my class schedule" }
  ];

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let suggestions: string[] = [];

    if (lowerMessage.includes("assignment") || lowerMessage.includes("homework")) {
      response = "I can help you with assignments! You currently have 3 pending assignments: Data Structures (due in 2 days), Research Methods (due in 5 days), and Web Development (due in 1 week). Would you like details on any specific assignment?";
      suggestions = ["Data Structures assignment", "Research Methods details", "All assignment deadlines"];
    } else if (lowerMessage.includes("library") || lowerMessage.includes("book") || lowerMessage.includes("research")) {
      response = "Great! I can help you access our extensive library resources. We have access to IEEE, ACM Digital Library, JSTOR, and local university databases. What subject are you researching?";
      suggestions = ["Computer Science resources", "Engineering papers", "Business journals", "Browse all databases"];
    } else if (lowerMessage.includes("campus") || lowerMessage.includes("direction") || lowerMessage.includes("map")) {
      response = "I can help you navigate campus! Are you looking for a specific building, facility, or service? I have real-time information about all campus locations across Zimbabwean universities.";
      suggestions = ["Find lecture halls", "Cafeteria locations", "Library building", "Student services"];
    } else if (lowerMessage.includes("program") || lowerMessage.includes("course") || lowerMessage.includes("degree")) {
      response = "I have information on all university programs across Zimbabwe! This includes undergraduate and postgraduate programs in Engineering, Computer Science, Business, Medicine, and more. Which field interests you?";
      suggestions = ["Engineering programs", "Computer Science courses", "Business degrees", "All programs"];
    } else if (lowerMessage.includes("schedule") || lowerMessage.includes("timetable") || lowerMessage.includes("class")) {
      response = "Your class schedule for this week: Monday - Data Structures (9AM), Wednesday - Web Development (11AM), Friday - Research Methods (2PM). Would you like to see your full semester schedule?";
      suggestions = ["Full semester schedule", "Upcoming classes", "Assignment deadlines", "Exam dates"];
    } else if (lowerMessage.includes("exam") || lowerMessage.includes("test")) {
      response = "I can help you prepare for exams! Based on your enrolled courses, you have Data Structures exam in 2 weeks and Web Development project submission next week. Would you like study resources?";
      suggestions = ["Study materials", "Past papers", "Exam schedule", "Study groups"];
    } else {
      response = "I'm here to help with university-related queries! I can assist with assignments, library resources, campus navigation, course information, schedules, and exam preparation. What would you like to know?";
      suggestions = ["My assignments", "Library access", "Campus map", "Course information"];
    }

    return {
      id: Date.now().toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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