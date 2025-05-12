const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');  // Add this to import socket.io


const userRoutes = require('./routes/users');
const followingRoutes = require('./routes/following');
const bookRoutes = require('./routes/books');
const playlistRoutes = require('./routes/playlists');
const favoriteRoutes = require('./routes/favorites');
const reviewRoutes = require('./routes/review');
const progressRoutes = require('./routes/progress');

const connectMongoDB = require('./config/mongodb');
const { sequelize, syncDatabase } = require('./models');


const app = express();


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/user', userRoutes);
app.use('/follow', followingRoutes);
app.use('/books', bookRoutes);
app.use('/playlists', playlistRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/review', reviewRoutes);
app.use('/progress', progressRoutes);


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

 
  socket.on("room:join", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined ${roomId}`);

    const users = io.sockets.adapter.rooms.get(roomId);

    if (users.size > 1) {
      const streamerId = [...users][0]; 

      io.to(streamerId).emit("room:listener-joined", socket.id); 
      io.to(socket.id).emit("room:streamer-connected", streamerId); 
    }
  });

 
  socket.on("peer:signal", (targetId, data) => {
    io.to(targetId).emit("peer:signal", socket.id, data);
    console.log(`Signal from ${socket.id} to ${targetId}`);
  });

  
  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
 
    if (socket.roomId) {
      socket.to(socket.roomId).emit("peer:disconnect", socket.id);
    }
  });
});
app.use('/review', reviewRoutes);

const initializeApp = async () => {
  try {
   
    await connectMongoDB();
    console.log('MongoDB connected successfully');
    
   
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully!');
 
    await syncDatabase();
    
   
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
};

initializeApp();

module.exports = app;
