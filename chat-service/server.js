import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store active users and chat rooms
const users = new Map();
const chatRooms = [
  { id: 'general', name: 'General', description: 'General discussions' },
  { id: 'tech', name: 'Technology', description: 'Tech talks' },
  { id: 'random', name: 'Random', description: 'Casual conversations' }
];

const messages = {
  general: [],
  tech: [],
  random: []
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user_join', (userData) => {
    users.set(socket.id, {
      id: socket.id,
      username: userData.username,
      room: 'general'
    });
    
    socket.join('general');
    
    // Send available rooms and current room messages
    socket.emit('rooms_list', chatRooms);
    socket.emit('room_messages', {
      room: 'general',
      messages: messages.general
    });
    
    // Notify others in the room
    socket.to('general').emit('user_joined', {
      username: userData.username,
      message: `${userData.username} joined the chat`
    });
  });

  // Handle room change
  socket.on('change_room', (data) => {
    const user = users.get(socket.id);
    if (user) {
      // Leave previous room
      socket.leave(user.room);
      
      // Join new room
      user.room = data.roomId;
      socket.join(data.roomId);
      
      // Send messages for new room
      socket.emit('room_messages', {
        room: data.roomId,
        messages: messages[data.roomId] || []
      });
      
      // Notify room change
      socket.to(data.roomId).emit('user_joined', {
        username: user.username,
        message: `${user.username} joined the room`
      });
    }
  });

  // Handle new message
  socket.on('send_message', (data) => {
    const user = users.get(socket.id);
    if (user && messages[user.room]) {
      const message = {
        id: Date.now().toString(),
        username: user.username,
        text: data.text,
        timestamp: new Date().toISOString(),
        room: user.room
      };
      
      messages[user.room].push(message);
      
      // Broadcast to room
      io.to(user.room).emit('new_message', message);
    }
  });

  // Handle typing indicator
  socket.on('typing_start', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.room).emit('user_typing', {
        username: user.username,
        isTyping: true
      });
    }
  });

  socket.on('typing_stop', () => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(user.room).emit('user_typing', {
        username: user.username,
        isTyping: false
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      socket.to(user.room).emit('user_left', {
        username: user.username,
        message: `${user.username} left the chat`
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});