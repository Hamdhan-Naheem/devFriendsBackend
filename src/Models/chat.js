const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);
const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  ],
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
