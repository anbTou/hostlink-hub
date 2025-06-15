
interface ConversationMessage {
  id: string;
  from: string;
  to: string;
  date: string;
  content: string;
  isRead: boolean;
}

interface ThreadMessage {
  id: string;
  subject: string;
  from: string;
  to: string[];
  date: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export function adaptMessagesToThreadFormat(
  messages: ConversationMessage[],
  subject: string
): ThreadMessage[] {
  return messages.map(message => ({
    id: message.id,
    subject: subject,
    from: message.from,
    to: [message.to], // Convert string to array
    date: message.date,
    text: message.content,
    timestamp: message.date,
    isRead: message.isRead
  }));
}
