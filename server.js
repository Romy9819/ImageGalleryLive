const mongoose = require('mongoose');
const express = require('express');
const userRoute = require('./routes/users');
const imageRoute = require('./routes/images');
const path = require('path');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://romymathew732:Romy12345@cluster0.i9rqt1e.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use('/uploads', express.static('uploads'));
app.use(userRoute, imageRoute)

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function(req, res){
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//Starting the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost/${port}`)
})