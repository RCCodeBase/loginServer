const router = require('express').Router();
const User = require('../models/Users.model.js');
const bcrypt = require('bcryptjs');
const jwt =   require('jsonwebtoken');
const { registerValidation, loginValidation } = require('./validation');

router.get('/', (req, res) => {
    res.send('User Page');
});

router.post('/', async (req, res) => {

    //Lets Validate the data before a user register
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already registered
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already Existed');

    //Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);



    //create a new user
    const userPerson = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    console.log(userPerson);
    try {
        const savedUser = await userPerson.save();
        res.json(savedUser);
    }
    catch (err) {
        res.json({ message: err });
    }
});


//Loginroute
router.post('/login', async (req, res) => {
    
    console.log(req.body);
    //Lets Validate the data before a user register
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already registered
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not registered');

    //CHecking Password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Password is not valid');

    //create and assign a token
    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    res.setHeader('token',token);
    res.send();
    // res.json('Logged In');

});

module.exports = router;