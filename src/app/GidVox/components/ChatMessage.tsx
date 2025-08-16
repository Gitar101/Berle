import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';

interface ChatMessageProps {
  sender: 'GIDEON' | 'Lord Berle';
  message: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, message, timestamp }) => {
  const isGideon = sender === 'GIDEON';

  return (
    <div className={`flex mb-4 ${isGideon ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[90%] transition-all duration-200 ease-in-out
          ${isGideon ? 'text-white p-4 rounded-lg' : 'p-3 rounded-lg shadow-md bg-[#8A2BE2] text-white hover:bg-[#9A3BEF]'}
        `}
      >
        {isGideon && (
          <div className="mb-2 flex items-center">
            <span className="flex-grow h-0.5 bg-purple-500"></span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mx-4">GIDEON</h2>
            <span className="flex-grow h-0.5 bg-purple-500"></span>
          </div>
        )}
        <div className={`text-base sm:text-lg font-inter ${isGideon ? 'prose prose-invert whitespace-pre-wrap' : ''}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
          >
            {message}
          </ReactMarkdown>
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isGideon ? 'text-left' : 'text-right'} font-inter`}>{timestamp}</p>
        {isGideon && (
          <div className="h-0.5 bg-purple-500 w-full mt-4 mx-auto"></div>
        )}
      </div>
      {!isGideon && (
        <div className="w-8 h-8 rounded-full bg-gray-500 flex-shrink-0 ml-2"></div>
      )}
    </div>
  );
};

export default ChatMessage;