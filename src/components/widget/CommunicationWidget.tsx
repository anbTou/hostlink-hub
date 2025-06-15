
import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WidgetConfig, WidgetMessage, CustomButton } from '@/types/widget';
import { cn } from '@/lib/utils';

interface CommunicationWidgetProps {
  config: WidgetConfig;
  onMessageSend: (message: string, routingContext?: any) => void;
  className?: string;
}

export function CommunicationWidget({ config, onMessageSend, className }: CommunicationWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'buttons' | 'chat' | 'whatsapp'>('buttons');
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedRouting, setSelectedRouting] = useState<CustomButton | null>(null);

  const handleButtonClick = (button: CustomButton) => {
    if (button.type === 'whatsapp' && config.whatsapp.redirectToWhatsApp) {
      const whatsappUrl = `https://wa.me/${config.whatsapp.phoneNumber}?text=${encodeURIComponent(config.whatsapp.prefilledMessage)}`;
      window.open(whatsappUrl, '_blank');
      return;
    }

    setSelectedRouting(button);
    setCurrentView('chat');
    
    // Add system message about routing
    const systemMessage: WidgetMessage = {
      id: Date.now().toString(),
      text: `You've been connected to ${button.text}. How can we help you?`,
      sender: 'system',
      timestamp: new Date().toISOString()
    };
    setMessages([systemMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: WidgetMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      routingContext: selectedRouting ? {
        buttonClicked: selectedRouting.text,
        targetInbox: selectedRouting.target
      } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    onMessageSend(inputValue, userMessage.routingContext);
    setInputValue('');

    // Simulate response
    setTimeout(() => {
      const responseMessage: WidgetMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! We'll get back to you shortly.",
        sender: 'system',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);
  };

  const getPositionClasses = () => {
    switch (config.appearance.position) {
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      default: return 'bottom-4 right-4';
    }
  };

  if (!config.isActive) return null;

  return (
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      {/* Widget Trigger Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
          style={{ backgroundColor: config.appearance.primaryColor }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Widget Content */}
      {isOpen && (
        <Card className="w-80 h-96 flex flex-col shadow-xl">
          {/* Header */}
          <div 
            className="p-4 text-white rounded-t-lg flex justify-between items-center"
            style={{ backgroundColor: config.appearance.primaryColor }}
          >
            <div>
              <h3 className="font-semibold">{config.appearance.companyName}</h3>
              <p className="text-sm opacity-90">
                {currentView === 'buttons' ? config.appearance.welcomeMessage : 'Chat with us'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {currentView === 'buttons' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  How can we help you today?
                </p>
                
                {config.customButtons.map((button) => (
                  <Button
                    key={button.id}
                    variant="outline"
                    className="w-full justify-start gap-2 h-12"
                    onClick={() => handleButtonClick(button)}
                  >
                    {button.icon && <span className="text-lg">{button.icon}</span>}
                    <span className="text-left">{button.text}</span>
                  </Button>
                ))}

                {config.whatsapp.showWhatsAppOption && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 h-12 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleButtonClick({
                      id: 'whatsapp',
                      text: 'Chat on WhatsApp',
                      type: 'whatsapp',
                      target: '',
                      order: 999
                    })}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </Button>
                )}
              </div>
            )}

            {currentView === 'chat' && (
              <div className="space-y-3">
                {selectedRouting && (
                  <Badge variant="secondary" className="mb-2">
                    {selectedRouting.text}
                  </Badge>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-2 rounded-lg max-w-[80%]",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          {currentView === 'chat' && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Back to options */}
          {currentView === 'chat' && (
            <div className="px-4 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentView('buttons');
                  setMessages([]);
                  setSelectedRouting(null);
                }}
                className="text-xs"
              >
                ← Back to options
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
