const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//REGISTER
router.post('/register', async (req, res) => {
  //VALIDATE DATA
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //CHECK IF USER EMAIL EXISTS
  const emailExist = await User.findOne({email: req.body.email});
  if(emailExist) return res.status(400).send('Email already exists');

  //PASSWORD HASHING
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //CREATE A NEW USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    res.json({user: user._id});
  } catch (err) {
    res.json({ message: err });
  }
});


//LOGIN
router.post('/login', async (req, res) => {
  //VALIDATE DATA
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //CHECK IF THE EMAIL EXISTS
  const user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Invalid email or password');

  //CHECK PASSWORD
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password');

  //CREATE TOKEN
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
  res.header('auth-token', token).send(token); 
});


module.exports = router;