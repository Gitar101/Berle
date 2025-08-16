import { NextResponse } from 'next/server';
import { db } from '@/db';
import { logsTable } from '@/db/schema';
import io from 'socket.io-client';
import { desc } from 'drizzle-orm';

const socket = io('http://localhost:3000');

interface ApiLogEntry {
  id: string;
  type: string; // e.g., "CHAT API REQUEST", "URL VISIT", "OTHER", "INFO", "DEBUG", "ERROR"
  message: string; // Already truncated if it's a chat message
  Model?: string; // Note the capital 'M' as per API response
  timestamp?: Date; // Make timestamp optional as it's now handled by the database
  previousLogType?: string;
  previousLogTimestamp?: Date;
}

export async function POST(request: Request) {
  try {
    const { type, message, Model, timestamp } = await request.json();
    
    console.log('Received log payload:', { type, message, Model, timestamp }); // Debugging line

    let emittedLog: ApiLogEntry;

    // Fetch the last log entry to determine sequence
    const lastLog = await db.query.logsTable.findFirst({
      orderBy: [desc(logsTable.timestamp)],
    });

    const previousLogType: string | undefined = lastLog?.type;
    const previousLogTimestamp: Date | undefined = lastLog?.timestamp;

    if (type === 'CHAT API REQUEST') {
      emittedLog = {
        id: crypto.randomUUID(),
        type: type,
        message: message,
        Model: Model,
        previousLogType: previousLogType,
        previousLogTimestamp: previousLogTimestamp,
      };
    } else if (type === 'URL VISIT') {
      emittedLog = {
        id: crypto.randomUUID(),
        type: type,
        message: message,
        previousLogType: previousLogType,
        previousLogTimestamp: previousLogTimestamp,
      };
    } else {
      // For other log types, or if the type is not explicitly 'CHAT API REQUEST' or 'URL VISIT'
      emittedLog = {
        id: crypto.randomUUID(),
        type: type || "UNKNOWN", // Use provided type or default to UNKNOWN
        message: message,
        Model: Model, // Include Model if present for other types too
        previousLogType: previousLogType,
        previousLogTimestamp: previousLogTimestamp,
      };
    }
    
    await db.insert(logsTable).values({
      message: emittedLog.message,
      type: emittedLog.type,
      Model: emittedLog.Model,
      // timestamp: new Date(emittedLog.timestamp), // Let the database handle the timestamp
      previousLogType: emittedLog.previousLogType,
      previousLogTimestamp: emittedLog.previousLogTimestamp,
    });
    socket.emit('log', emittedLog);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging message:', error);
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 });
  }
}