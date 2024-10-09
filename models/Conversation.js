const mongoose = require('mongoose');
const { type } = require('os');

const conversatationSchema = mongoose.Schema({
    members: { 
        type : Array,
        required : true,
    },
   
});

const Conversation = mongoose.model('Conversation',conversatationSchema);

module.exports = Conversation;