"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload } from 'lucide-react';
import Image from 'next/image';

interface AiModel {
  id: string;
  name: string;
}

const SettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [systemPrompt, setSystemPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('systemPrompt') || "You are a helpful AI assistant named Gideon. Respond naturally and be concise unless asked for detailed explanations.";
    }
    return "You are a helpful AI assistant named Gideon. Respond naturally and be concise unless asked for detailed explanations.";
  });
  const [aiModels, setAiModels] = useState<AiModel[]>([]);
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedModel') || '';
    }
    return '';
  });
  const [temperature, setTemperature] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseFloat(localStorage.getItem('temperature') || '0.7');
    }
    return 0.7;
  });

  const availableGroqModels: AiModel[] = useMemo(() => [
    { id: 'llama-3.1-8b-instant', name: 'llama-3.1-8b-instant' },
    { id: 'llama-3.3-70b-versatile', name: 'llama-3.3-70b-versatile' },
    { id: 'meta-llama/llama-guard-4-12b', name: 'meta-llama/llama-guard-4-12b' },
    { id: 'whisper-large-v3', name: 'whisper-large-v3' },
    { id: 'whisper-large-v3-turbo', name: 'whisper-large-v3-turbo' },
    { id: 'deepseek-r1-distill-llama-70b', name: 'deepseek-r1-distill-llama-70b' },
    { id: 'meta-llama/llama-4-maverick-17b-128e-instruct', name: 'meta-llama/llama-4-maverick-17b-128e-instruct' },
    { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'meta-llama/llama-4-scout-17b-16e-instruct' },
    { id: 'meta-llama/llama-prompt-guard-2-22m', name: 'meta-llama/llama-prompt-guard-2-22m' },
    { id: 'meta-llama/llama-prompt-guard-2-86m', name: 'meta-llama/llama-prompt-guard-2-86m' },
    { id: 'moonshotai/kimi-k2-instruct', name: 'moonshotai/kimi-k2-instruct' },
    { id: 'openai/gpt-oss-120b', name: 'openai/gpt-oss-120b' },
    { id: 'openai/gpt-oss-20b', name: 'openai/gpt-oss-20b' },
    { id: 'playai-tts', name: 'playai-tts' },
    { id: 'playai-tts-arabic', name: 'playai-tts-arabic' },
    { id: 'qwen/qwen3-32b', name: 'qwen/qwen3-32b' },
  ], []);

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
            message: `Visited URL: /GidVox/settings`,
          }),
        });
        if (!response.ok) {
          console.error(`Failed to log URL visit for /GidVox/settings. Status: ${response.status}`);
        } else {
          console.log(`Successfully logged URL visit for /GidVox/settings`);
        }
      } catch (error) {
        console.error('Error logging URL visit for /GidVox/settings:', error);
      }
    };
    logUrlVisit();

    setAiModels(availableGroqModels);
    // If selectedModel is not set or not in the hardcoded models, set to the first available
    if (!selectedModel || !availableGroqModels.some((model: AiModel) => model.id === selectedModel)) {
      if (availableGroqModels.length > 0) {
        setSelectedModel(availableGroqModels[0].id);
      }
    }
  }, [selectedModel, availableGroqModels]); // Depend on selectedModel and availableGroqModels to re-evaluate if it's valid after models are set

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('systemPrompt', systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    localStorage.setItem('temperature', temperature.toString());
  }, [temperature]);

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(parseFloat(e.target.value));
  };

  const handleImageUpload = () => {
    // Placeholder for image upload logic
    alert('Image upload functionality will be implemented later.');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="focus:outline-none">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="text-2xl font-bold font-inter">AI Settings</h1>
        <div className="w-6"></div> {/* Placeholder for alignment */}
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-purple-400">Username</h2>
        <input
          type="text"
          value={session?.user?.name || ''}
          readOnly
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />
      </section>

      <section className="mb-8 flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Icon"
              width={96} // Set explicit width
              height={96} // Set explicit height
              style={{ objectFit: 'cover', borderRadius: '9999px' }} // Ensure it's circular and covers
            />
          ) : (
            <span className="text-white text-4xl">{session?.user?.name ? session.user.name.charAt(0).toUpperCase() : ''}</span>
          )}
        </div>
        <button
          onClick={handleImageUpload}
          className="flex items-center px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 focus:outline-none"
        >
          <Upload className="h-5 w-5 mr-2" />
          UPLOAD PICTURE
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-purple-400">AI Model</h2>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
        >
          {aiModels.map((model: AiModel) => (
            <option key={model.id} value={model.id}>
              {model.name || model.id}
            </option>
          ))}
        </select>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-purple-400">Temperature: {temperature.toFixed(1)}</h2>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={handleTemperatureChange}
          className="w-full h-2 bg-purple-600 rounded-lg appearance-none cursor-pointer"
        />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-purple-400">System Prompt</h2>
        <textarea
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none h-32 resize-none"
          placeholder="Enter system prompt here..."
        ></textarea>
      </section>
    </div>
  );
};

export default SettingsPage;