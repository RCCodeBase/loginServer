//Taking express to the project
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();

//Import Routes
const usersRoute = require("./routes/user");
const postRoute = require("./routes/post");

app.use(cors());
app.use(express.json());
//Adding middleware to point to userRoute
app.use('/users',usersRoute);
app.use('/post',postRoute);


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});



//Telling Which port to listen to
app.listen(3000,() => console.log("Server Started"));