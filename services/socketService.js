import CodeBlock from '../models/CodeBlock.js';

// Track active sessions
const activeSessions = {};

class SocketService {
  constructor(io) {
    this.io = io;
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('New client connected');
      this.handleConnection(socket);
    });
  }

  handleConnection(socket) {
    // Join a code block room
    socket.on('join-code-block', async (codeBlockId) => {
      try {
        await this.handleJoinCodeBlock(socket, codeBlockId);
      } catch (error) {
        console.error('Error joining code block:', error);
        socket.emit('error', 'Failed to join code block');
      }
    });

    // Leave a code block room
    socket.on('leave-code-block', async (codeBlockId) => {
      try {
        await this.handleLeaveCodeBlock(socket, codeBlockId);
      } catch (error) {
        console.error('Error leaving code block:', error);
        socket.emit('error', 'Failed to leave code block');
      }
    });

    // Handle code changes
    socket.on('code-change', ({ codeBlockId, code }) => {
      this.handleCodeChange(socket, codeBlockId, code);
    });

    // Handle hints changes
    socket.on('hints-change', ({ codeBlockId, hints }) => {
      try {
        this.handleHintsChange(socket, codeBlockId, hints);
      } catch (error) {
        console.error('Error handling hints change:', error);
        socket.emit('error', 'Failed to update hints');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  }

  async handleJoinCodeBlock(socket, codeBlockId) {
    const codeBlock = await CodeBlock.findById(codeBlockId);
    
    if (!codeBlock) {
      return socket.emit('error', 'Code block not found');
    }

    // Join the room
    socket.join(codeBlockId);

    // Initialize session if doesn't exist
    if (!activeSessions[codeBlockId]) {
      activeSessions[codeBlockId] = {
        hints: '',
        currentCode: codeBlock.initialCode
      };
    }

    // Send current hints and code to the new user
    socket.emit('hints-update', activeSessions[codeBlockId].hints);
    socket.emit('code-update', activeSessions[codeBlockId].currentCode);

    // Increment active users
    codeBlock.activeUsers++;
    
    // First user becomes mentor
    let role = 'student';
    if (!codeBlock.mentorConnected) {
      codeBlock.mentorConnected = true;
      codeBlock.isActive = true;
      role = 'mentor';
    }
    socket.role = role;

    await codeBlock.save();

    // Broadcast session update to all clients in the room
    this.io.to(codeBlockId).emit('session-update', {
      isActive: codeBlock.isActive,
      activeUsers: codeBlock.activeUsers,
      mentorConnected: codeBlock.mentorConnected
    });

    socket.emit('role-assigned', { role });
    console.log(`User joined code block ${codeBlockId} as ${role}`);
  }

  async handleLeaveCodeBlock(socket, codeBlockId) {
    const codeBlock = await CodeBlock.findById(codeBlockId);
    
    if (!codeBlock) {
      return socket.emit('error', 'Code block not found');
    }

    // Leave the room
    socket.leave(codeBlockId);

    // Decrement active users
    codeBlock.activeUsers--;

    // If mentor leaves, reset entire session
    const isMentor = socket.role === 'mentor';

    if (isMentor) {
      // Only if mentor leaves, reset entire session
      this.io.to(codeBlockId).emit('session-reset');
    
      // Reset all session-related fields
      codeBlock.isActive = false;
      codeBlock.activeUsers = 0;
      codeBlock.mentorConnected = false;
      
      // ניקוי הסשן כשהמנטור עוזב
      if (activeSessions[codeBlockId]) {
        activeSessions[codeBlockId] = {
          hints: '',
          currentCode: codeBlock.initialCode
        };
      }
    }

    await codeBlock.save();

    // Broadcast session update to all clients in the room
    this.io.to(codeBlockId).emit('session-update', {
      isActive: codeBlock.isActive,
      activeUsers: codeBlock.activeUsers,
      mentorConnected: codeBlock.mentorConnected
    });

    console.log(`User left code block ${codeBlockId}`);
  }

  handleCodeChange(socket, codeBlockId, code) {
    console.log('Server received code change:', { codeBlockId, code });
    
    // שמירת הקוד הנוכחי בזיכרון
    if (!activeSessions[codeBlockId]) {
      activeSessions[codeBlockId] = { 
        hints: '',
        currentCode: code 
      };
    } else {
      activeSessions[codeBlockId].currentCode = code;
    }
    
    // שליחת העדכון לכל המשתמשים בחדר (כולל השולח)
    this.io.to(codeBlockId).emit('code-update', code);
  }

  handleHintsChange(socket, codeBlockId, hints) {
    console.log('Server received hints change:', { codeBlockId, hints });
    
    // שמירת הרמזים בזיכרון
    if (!activeSessions[codeBlockId]) {
      activeSessions[codeBlockId] = { 
        hints,
        currentCode: '' 
      };
    } else {
      activeSessions[codeBlockId].hints = hints;
    }

    // שליחת הרמזים לכל המשתמשים בחדר (כולל השולח)
    this.io.to(codeBlockId).emit('hints-update', hints);
  }
}

export default SocketService; 