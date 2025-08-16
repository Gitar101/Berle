'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { useChat } from './hooks/useChat';


const GidVoxPage: React.FC = () => {
  const { messages, loading, handleSendMessage } = useChat();
  const [selectedModel, setSelectedModel] = useState('llama3-70b-8192'); // Default model
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant named Gideon. Respond naturally and be concise unless asked for detailed explanations."); // Default system prompt

  useEffect(() => {
    // Log URL visit on component mount
    const logUrlVisit = async () => {
      try {
        const response = await fetch('/api/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'URL VISIT',
            message: `Visited URL: /GidVox`,
          }),
        });
        if (!response.ok) {
          console.error(`Failed to log URL visit for /GidVox. Status: ${response.status}`);
        } else {
          console.log(`Successfully logged URL visit for /GidVox`);
        }
      } catch (error) {
        console.error('Error logging URL visit for /GidVox:', error);
      }
    };
    logUrlVisit();

    // Load settings from localStorage
    const storedModel = localStorage.getItem('selectedModel');
    const storedSystemPrompt = localStorage.getItem('systemPrompt');

    if (storedModel) {
      setSelectedModel(storedModel);
    }
    if (storedSystemPrompt) {
      setSystemPrompt(storedSystemPrompt);
    }
  }, []);

  const sendMessageWithSettings = (message: string) => {
    handleSendMessage(message, selectedModel, systemPrompt);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black to-purple-950 font-inter">
      <Header />
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            sender={msg.sender}
            message={msg.message}
            timestamp={msg.timestamp}
          />
        ))}
        {loading && <div className="text-white text-center py-2">Loading...</div>}
      </div>
      <InputArea onSendMessage={sendMessageWithSettings} />
    </div>
  );
};

export default GidVoxPage;