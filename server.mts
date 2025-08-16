import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  interface ApiLogEntry {
    id: string;
    type: string; // e.g., "CHAT API REQUEST", "OTHER", "INFO", "DEBUG", "ERROR"
    message: string; // Already truncated if it's a chat message
    Model?: string; // Note the capital 'M' as per API response
    timestamp: string;
  }

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('log', (logEntry: ApiLogEntry) => {
      // The logEntry is already a structured object from the API route
      // No need for regex parsing here, just emit the received log
      io.emit('log', logEntry);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});