import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all for now
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('joinRoom', (roomCode) => {
            socket.join(roomCode);
            console.log(`Socket ${socket.id} joined room ${roomCode}`);
        });

        socket.on('nextQuestion', ({ roomCode, index }) => {
            io.to(roomCode).emit('nextQuestion', { index });
        });

        socket.on('syncState', ({ roomCode, state }) => {
            // Allow host to sync state to others if needed
            socket.to(roomCode).emit('state', state);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
