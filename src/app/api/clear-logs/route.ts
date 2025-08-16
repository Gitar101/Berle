import { db } from '@/db';
import { logsTable } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  try {
    await db.delete(logsTable).execute();
    return NextResponse.json({ message: 'Logs cleared successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to clear logs:', error);
    return NextResponse.json({ message: 'Failed to clear logs', error: (error as Error).message }, { status: 500 });
  }
}