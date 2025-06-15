
export interface WidgetConfig {
  id: string;
  name: string;
  isActive: boolean;
  appearance: WidgetAppearance;
  routing: WidgetRouting;
  whatsapp: WhatsAppConfig;
  customButtons: CustomButton[];
  createdAt: string;
  updatedAt: string;
}

export interface WidgetAppearance {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  borderRadius: number;
  showAvatar: boolean;
  companyName: string;
  welcomeMessage: string;
  offlineMessage: string;
}

export interface WidgetRouting {
  defaultInbox: string;
  routingRules: RoutingRule[];
  autoAssignment: boolean;
}

export interface RoutingRule {
  id: string;
  buttonText: string;
  targetInbox: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  phoneNumber: string;
  redirectToWhatsApp: boolean;
  prefilledMessage: string;
  showWhatsAppOption: boolean;
}

export interface CustomButton {
  id: string;
  text: string;
  type: 'routing' | 'external' | 'whatsapp';
  target: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface WidgetPreviewState {
  view: 'desktop' | 'mobile';
  state: 'closed' | 'open' | 'chat';
  selectedButton?: string;
}

export interface WidgetMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  routingContext?: {
    buttonClicked: string;
    targetInbox: string;
  };
}
