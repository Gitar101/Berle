import React from 'react';
import { Send } from 'lucide-react';

import { useState } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="p-4 flex items-center">
      <input
        type="text"
        placeholder="Message Gideon..."
        className="flex-grow p-3 rounded-lg bg-transparent border border-purple-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] font-inter"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSend}
        className="ml-4 p-3 bg-[#8A2BE2] rounded-lg hover:bg-[#9A3BEF] transition-colors duration-200 ease-in-out flex items-center justify-center"
      >
        <Send className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default InputArea;