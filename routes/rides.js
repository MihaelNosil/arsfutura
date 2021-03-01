const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const verify = require('./verifyToken');
const {createRideValidation} = require('../validation');

//GET BACK ALL RIDES IN FUTURE
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find({ departure: { $gte: Date.now() } }).sort({ departure: 'asc', title: 'asc'});
    res.json(rides);
    res.end();
  } catch (err){
    res.json({message: err});
  }
});


//SUBMIT A RIDE
router.post('/', verify, async (req, res) => {
  //VALIDATE DATA
  const {error} = createRideValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  //CHECK IF RIDE ALREADY EXISTS
  try {
    const ride = await Ride.find({ departure: req.body.departure, title: req.body.title });
    if(ride) return res.status(403).send('Ride already exists');
  } catch (error) {
    res.json({ message: err });
  }
    
  //CREATE A NEW RIDE
  const ride = new Ride({
    title: req.body.title,
    departure: req.body.departure,
    arrival: req.body.arrival,
    space: req.body.space,
    companyName: req.body.companyName
  });

  //SAVE RIDE TO DB
  try {
    const savedRide = await ride.save();
    res.json(savedRide);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;