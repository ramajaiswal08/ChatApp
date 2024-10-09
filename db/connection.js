const mongoose = require('mongoose');

const url =  "mongodb://localhost:27017/admin";

mongoose.connect(url, { 
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => console.log('Connected to DB')).catch((e) => console.log('Error' , e))