const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  },
}, { timestamps: true });  // Include timestamps to record creation and update times.

const Messages = mongoose.model('Messages', messageSchema);  // Change to 'Messages' instead of 'Message'.

module.exports = Messages;
