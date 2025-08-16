"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { Menu, Home } from "lucide-react"; // For the hamburger icon and home icon
import Link from "next/link";
import ModelFilter from "./components/ModelFilter";
import { useMediaQuery } from "@/hooks/use-media-query"; // Assuming this hook exists or will be created

interface LogPart {
  text: string;
  colorClass: string;
}

interface ApiLogEntry {
  id: string;
  type: string; // e.g., "CHAT API REQUEST", "OTHER", "INFO", "DEBUG", "ERROR"
  message: string; // Already truncated if it's a chat message
  Model?: string; // Note the capital 'M' as per API response
  timestamp: string;
}

interface DisplayLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'debug' | 'error' | 'chat' | 'unknown' | 'other';
  message: string;
  model?: string; // Lowercase for internal consistency
  type: string; // From API
  parts: LogPart[];
  indentClass: string;
}


const getLogColorClass = (level: DisplayLogEntry['level']): string => {
  switch (level) {
    case 'info':
      return 'text-blue-400';
    case 'debug':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'chat':
      return 'text-purple-400'; // Base color for chat logs
    default:
      return 'text-gray-300';
  }
};

const modelColorMap = new Map<string, string>();
const tailwindColors = [
  'text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400',
  'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-teal-400',
  'text-orange-400', 'text-lime-400', 'text-emerald-400', 'text-cyan-400',
  'text-sky-400', 'text-violet-400', 'text-fuchsia-400', 'text-rose-400',
];

const getModelColorClass = (modelName: string | undefined): string => {
  if (!modelName) {
    return 'text-gray-500'; // Default color for undefined models
  }
  if (modelColorMap.has(modelName)) {
    return modelColorMap.get(modelName)!;
  }

  // Simple deterministic color assignment based on model name hash
  let hash = 0;
  for (let i = 0; i < modelName.length; i++) {
    hash = modelName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % tailwindColors.length;
  const assignedColor = tailwindColors[colorIndex];
  modelColorMap.set(modelName, assignedColor);
  return assignedColor;
};

const TerminalPage = () => {
  const [logs, setLogs] = useState<DisplayLogEntry[]>([]);
  const [allApiLogs, setAllApiLogs] = useState<ApiLogEntry[]>([]); // Changed from allRawLogs to allApiLogs
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)"); // Tailwind's md breakpoint

  const processLogsForDisplay = (
    apiLogs: ApiLogEntry[], // Changed input type
    currentSelectedModels: string[]
  ): DisplayLogEntry[] => {
    const processedLogs: DisplayLogEntry[] = [];
    let currentChatSequence: DisplayLogEntry[] = [];
    let currentUrlVisitSequence: DisplayLogEntry[] = [];

    const flushChatSequence = () => {
      if (currentChatSequence.length > 0) {
        // Add the parent "Chat API Request" entry
        const firstLog = currentChatSequence[0];
        processedLogs.push({
          id: firstLog.id,
          timestamp: firstLog.timestamp,
          level: 'chat',
          message: firstLog.message,
          model: firstLog.model,
          type: firstLog.type,
          parts: [
            { text: 'Chat API Request: ', colorClass: getLogColorClass('chat') },
            { text: firstLog.message, colorClass: getLogColorClass('chat') },
            ...(firstLog.model ? [{ text: ` (${firstLog.model})`, colorClass: getModelColorClass(firstLog.model) }] : []),
          ],
          indentClass: '',
        });

        // Add the child messages with tree prefixes
        for (let i = 1; i < currentChatSequence.length; i++) {
          const log = currentChatSequence[i];
          const isLastInSequence = i === currentChatSequence.length - 1;
          const prefix = isLastInSequence ? '└── ' : '├── ';
          processedLogs.push({
            id: log.id,
            timestamp: log.timestamp,
            level: 'chat',
            message: log.message,
            model: log.model,
            type: log.type,
            parts: [
              { text: `${prefix}${log.message}`, colorClass: getLogColorClass('chat') },
              ...(log.model ? [{ text: ` (${log.model})`, colorClass: getModelColorClass(log.model) }] : []),
            ],
            indentClass: 'pl-4',
          });
        }
        currentChatSequence = [];
      }
    };

    const flushUrlVisitSequence = () => {
      if (currentUrlVisitSequence.length > 0) {
        const firstLog = currentUrlVisitSequence[0];
        processedLogs.push({
          id: firstLog.id,
          timestamp: firstLog.timestamp,
          level: 'info', // Or a specific 'url' level if defined
          message: firstLog.message,
          model: firstLog.model,
          type: firstLog.type,
          parts: [
            { text: 'URL Visit: ', colorClass: getLogColorClass('info') }, // Parent label
            { text: firstLog.message, colorClass: getLogColorClass('info') },
          ],
          indentClass: '',
        });

        for (let i = 1; i < currentUrlVisitSequence.length; i++) {
          const log = currentUrlVisitSequence[i];
          const isLastInSequence = i === currentUrlVisitSequence.length - 1;
          const prefix = isLastInSequence ? '└── ' : '├── ';
          processedLogs.push({
            id: log.id,
            timestamp: log.timestamp,
            level: 'info',
            message: log.message,
            model: log.model,
            type: log.type,
            parts: [
              { text: `${prefix}${log.message}`, colorClass: getLogColorClass('info') },
            ],
            indentClass: 'pl-4',
          });
        }
        currentUrlVisitSequence = [];
      }
    };

    const filteredApiLogs = apiLogs.filter((logEntry) => {
      if (logEntry.type === 'CHAT API REQUEST' && logEntry.Model) {
        return (
          currentSelectedModels.length === 0 ||
          currentSelectedModels.includes(logEntry.Model)
        );
      }
      return true;
    });

    for (const logEntry of filteredApiLogs) {
      if (logEntry.type === 'CHAT API REQUEST') {
        flushUrlVisitSequence(); // Flush any pending URL visit sequence
        currentChatSequence.push({
          id: logEntry.id,
          timestamp: logEntry.timestamp,
          level: 'chat',
          message: logEntry.message,
          model: logEntry.Model,
          type: logEntry.type,
          parts: [],
          indentClass: '',
        });
      } else if (logEntry.type === 'URL VISIT') {
        flushChatSequence(); // Flush any pending chat sequence
        currentUrlVisitSequence.push({
          id: logEntry.id,
          timestamp: logEntry.timestamp,
          level: 'info', // Assuming 'info' for URL visits, adjust if a specific 'url' level is desired
          message: logEntry.message,
          model: logEntry.Model,
          type: logEntry.type,
          parts: [], // Parts will be generated in flushUrlVisitSequence
          indentClass: '',
        });
      }
      else {
        flushChatSequence(); // Flush any pending chat sequence
        flushUrlVisitSequence(); // Flush any pending URL visit sequence
        const level = logEntry.type.toLowerCase() as DisplayLogEntry['level'];
        processedLogs.push({
          id: logEntry.id,
          timestamp: logEntry.timestamp,
          level: level,
          message: logEntry.message,
          model: logEntry.Model,
          type: logEntry.type,
          parts: [{ text: `${logEntry.type} - ${logEntry.message}`, colorClass: getLogColorClass(level) }],
          indentClass: '',
        });
      }
    }
    flushChatSequence(); // Flush any remaining chat sequence at the end
    flushUrlVisitSequence(); // Flush any remaining URL visit sequence at the end
    return processedLogs;
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('/api/logs');
      const data: ApiLogEntry[] = await response.json(); // Changed data type
      setAllApiLogs(data); // Store all API logs directly
    };

    fetchLogs();

    const socket = io();

    socket.on("connect", () => {
      console.log("connected to socket server");
    });

    socket.on("log", (logEntry: ApiLogEntry) => { // Directly receive ApiLogEntry
      setAllApiLogs((prevAllApiLogs) => [...prevAllApiLogs, logEntry]);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array for initial setup

  useEffect(() => {
    // Re-process logs when selectedModels or allApiLogs change
    setLogs(processLogsForDisplay(allApiLogs, selectedModels));
  }, [selectedModels, allApiLogs]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-purple-950">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside className="w-72 bg-white/10 p-4 border-r border-white/40 flex-shrink-0 flex flex-col justify-center">
          <ModelFilter
            onSelectedModelsChange={setSelectedModels}
            selectedModels={selectedModels}
          />
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-[#282c34] rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center p-3 border-b border-gray-700 relative">
            {!isDesktop && (
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5 text-gray-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-white/10 border-r border-white/40 flex flex-col justify-center">
                  <ModelFilter
                    onSelectedModelsChange={setSelectedModels}
                    selectedModels={selectedModels}
                  />
                </SheetContent>
              </Sheet>
            )}
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex-grow text-center text-gray-400 text-sm font-mono">
              Terminal Logs
            </div>
            <Link href="/" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Home className="h-5 w-5 text-gray-400" />
            </Link>
          </div>

        {/* Terminal Content */}
        <div className="pl-8 pr-8 py-4 text-gray-300 font-mono text-sm overflow-auto max-h-[75vh]">
          <pre>
            <code>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-start whitespace-pre-wrap break-words gap-4 ${log.indentClass}`}
                  >
                    <div className="flex-1 overflow-hidden min-w-0">
                      {log.parts.map((part, partIndex) => (
                        <span key={partIndex} className={part.colorClass}>
                          {part.text}
                        </span>
                      ))}
                    </div>
                    {log.timestamp && (
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Waiting for logs...</div>
              )}
            </code>
          </pre>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;