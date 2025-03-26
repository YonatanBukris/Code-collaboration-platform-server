import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import codeBlockRoutes from './routes/codeBlockRoutes.js';
import SocketService from './services/socketService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://your-netlify-app.netlify.app',
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Routes
app.use('/api/code-blocks', codeBlockRoutes);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://your-netlify-app.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket service
const socketService = new SocketService(io);
socketService.initialize();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };