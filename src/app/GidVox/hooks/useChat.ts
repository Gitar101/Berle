import { useState } from 'react';

export interface Message {
  sender: 'GIDEON' | 'Lord Berle';
  message: string;
  timestamp: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (newMessage: string, selectedModel: string, systemPrompt: string) => {
    const userMessage: Message = {
      sender: 'Lord Berle',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          chatHistory: messages.map(msg => ({
            role: msg.sender === 'Lord Berle' ? 'user' : 'ai',
            content: msg.message
          })),
          model: selectedModel,
          systemPrompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader from response body');
      }

      const decoder = new TextDecoder();
      let receivedMessage = '';
      let gideonResponseIndex = -1;

      // Add a placeholder for the AI response
      setMessages((prevMessages) => {
        gideonResponseIndex = prevMessages.length;
        return [...prevMessages, {
          sender: 'GIDEON',
          message: '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      });

      const allChunks: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        receivedMessage += chunk;
        allChunks.push(chunk);

        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          if (gideonResponseIndex !== -1) {
            newMessages[gideonResponseIndex] = {
              ...newMessages[gideonResponseIndex],
              message: receivedMessage,
            };
          }
          return newMessages;
        });
      }
      console.log('COMPLETE RAW AI RESPONSE: \n', allChunks.join('')); // Log the complete raw response
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        sender: 'GIDEON',
        message: 'Error: Could not get a response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, handleSendMessage };
};