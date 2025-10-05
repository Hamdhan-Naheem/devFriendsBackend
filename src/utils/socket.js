const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../Models/chat');

const hashRoomId = (userId, targetId) => {
  return crypto
    .createHash('sha256')
    .update([userId, targetId].sort().join('_'))
    .digest('hex');
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    //events
    socket.on('joinChat', ({ firstName, userId, targetId }) => {
      const roomId = hashRoomId(userId, targetId);
      console.log(firstName + ' joined ' + roomId);
      socket.join(roomId);
    });

    socket.on('sendMessage', async ({ firstName, userId, targetId, text }) => {
      const roomId = hashRoomId(userId, targetId);

      try {
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });
        await chat.save();
        //the receive message is sending to room id
        io.to(roomId).emit('receivedMessage', { firstName, text });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('disconnect', () => {});
  });
};

module.exports = initializeSocket;
