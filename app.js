const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

//Connect Db
require('./db/connection');

//Import Files
const Users = require('./models/Users');
const Conversation = require('./models/Conversation');
const Messages = require('./models/Messages');

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.get('/',(req,res) => {
    res.send('Welcome');
})

app.post('/api/register', async (req, res) => {
  try {
      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
          return res.status(400).send('Please fill all required fields');
      } else {
          const isAlreadyExist = await Users.findOne({ email });
          if (isAlreadyExist) {
              return res.status(400).send('User already exists');
          } else {
              const newUser = new Users({ fullName, email });
              const hashedPassword = await bcryptjs.hash(password, 10);
              newUser.set('password', hashedPassword);
              await newUser.save();
              return res.status(200).send('User registered successfully');
          }
      }
  } catch (error) {
      console.log(error, 'Error');
      return res.status(500).send('Server error');
  }
});

app.post('/api/login',async (req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            res.status(400).send('Please fill all required fields');
         }else {
           const user = await Users.findOne({email});
           if(!user) {
            res.status(400).send('User email or password is inncorrect');
           }else {
            const validateUser = await bcryptjs.compare(password,user.password);
            if(!validateUser){
                res.status(400).send('User email or password is incorrect');
            }else{
                const payload = {
                    userId : user._id,
                    email : user.email
                }
                const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'ThIS_IS_A_JWT_SECRET_KEY';

              jwt.sign(payload,JWT_SECRET_KEY,{expiresIn: 84600} , async (err,token) => {
                if (err) {
                  return res.status(500).send('Error generating token');
              }

                await Users.updateOne({_id: user._id},{$set: {token} });
                user.token = token;
               await user.save();

               return res.status(200).json({ user: { email: user.email, fullName: user.fullName }, token });
            });           
            }
           }

         }
    }catch ( error){
      console.log(error,'Error');
      return res.status(500).send('Server error'); 
    }
}) 

app.post('/api/conversation' , async(req,res) => {
  try{
    const {senderId,receiverId} = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).send('Sender ID and Receiver ID are required.');
  }
    const newConversation = new Conversation({members : [senderId,receiverId]});
    await newConversation.save();
    res.status(200).send('Conversation created successfully')
  }
  catch (error){
    console.log(error,'Error');
    return res.status(500).send('Server error'); 
  }

})

app.get("/api/conversation/:userId",async(req,res) => {
  try {
    const userId = req.params.userId;
    const conversation = await Conversation.find({members: {$in: [userId] } });
    const conversationUserData =Promise.all(conversation.map(async(conversation) => {
      const receiverId = conversation.members.find((member) => member !== userId);
      const user = await Users.findById(receiverId);
        return {user: { email: user.email, fullName: user.fullName }, conversationId:conversation._id}
    }))
    res.status(200).json(await conversationUserData);
  }
  catch(error){
     console.log(error,'Error')
  }

})

app.post('/api/message', async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = '' } = req.body;

    // Properly check for required fields
    if (!senderId || !message) return res.status(400).send('Please fill all required fields');

    let newConversation;
    // If no conversationId is provided, create a new conversation
    if (!conversationId) {
      if (!receiverId) return res.status(400).send('Receiver ID is required to create a new conversation');

      newConversation = new Conversation({ members: [senderId, receiverId] });
      await newConversation.save();
    }

    // Use the new conversationId if created, or use the existing one
    const conversationIdentifier = conversationId || newConversation._id;

    // Create and save the new message
    const newMessage = new Messages({ conversationId: conversationIdentifier, senderId, message });
    await newMessage.save();

    res.status(200).send('Message sent successfully');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Server error');
  }
}); 


app.get('/api/message/:conversationId' , async(req,res) => {
  try{
    const conversationId = req.params.conversationId;
    if(conversationId === 'new') return res.status(200).json([]);
    const messages = await Messages.find({conversationId});
    const messageUserData = Promise.all(messages.map(async (message) => {
      const user = await Users.findById(message.senderId);
      return {user : {email:user.email,fullName:user.fullName , message:message.message}}
    }));
    res.status(200).json( await messageUserData);
  }catch(error){
    console.error('Error:', error);
  }
})

app.get('/api/users' ,async (req,res) => {
  try{
    const users = await Users.find();
    const usersData = Promise.all(users.map(async (user) => {
      return {user : {email:user.email,fullName:user.fullName , userId:user._id}}
    }))
    res.status(200).json(await usersData);
  }catch(error) { 
    console.log('Error' , error)
  }
})

app.listen(port, () => {
    console.log('listening on port ' + port);
}); 