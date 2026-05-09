const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://urmomisfa.github.io", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bettingapp').then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/bets', require('./routes/bets'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend is running. Use /api/* endpoints.' });
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinEvent', (eventId) => {
    socket.join(eventId);
  });

  socket.on('leaveEvent', (eventId) => {
    socket.leave(eventId);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.eventId).emit('message', data);
  });

  socket.on('privateMessage', (data) => {
    io.to(data.to).emit('privateMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));