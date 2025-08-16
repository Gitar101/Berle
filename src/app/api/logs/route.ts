import { NextResponse } from 'next/server';
import { db } from '@/db';
import { logsTable } from '@/db/schema';

export async function GET() {
  try {
    const logs = await db.select().from(logsTable).orderBy(logsTable.timestamp);
    const modifiedLogs = logs.map(log => {
      return {
        id: log.id,
        type: log.type,
        message: log.message,
        Model: log.Model,
        timestamp: log.timestamp,
        previousLogType: log.previousLogType,
        previousLogTimestamp: log.previousLogTimestamp,
      };
    });
    return NextResponse.json(modifiedLogs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}