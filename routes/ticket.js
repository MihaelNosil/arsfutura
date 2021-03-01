const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const verify = require('./verifyToken');
const {buyTicketValidation} = require('../validation');

//GET BACK ALL PURCHASED TICKETS
router.get('/', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const tickets = await Ticket.find({userName: user.name}).sort({departure: 'desc', name: 'desc'});
    if(tickets) res.json(tickets);
  } catch (err){
    res.json({message: err});
  }
});


//BUY TICKET FOR SPECIFIC RIDE
router.post('/buy/:rideId', verify, async (req, res) => {
  //VALIDATE DATA
  const {error} = buyTicketValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.user._id);
  
  //FIND RIDE
  try { 
    const ride = await Ride.findById(req.params.rideId);
    
    //CHECK IF THERE IS SPACE ON RIDE
    const tickets = await Ticket.find({title: ride.title, departure: ride.departure, canceled: false});
    var soldTickets = tickets.length;
    if(ride.space <= soldTickets) return res.status(400).send('No more space on ride');  
    
    //CHECK IF RIDE IS IN PAST
    if(ride.departure < Date.now()) return res.status(400).send('Ride has already started');
    
    //CREATE A NEW TICKET
    const ticket = new Ticket({
      title: ride.title,
      departure: ride.departure,
      arrival: ride.arrival,
      companyName: ride.companyName,
      userName: user.name,
      cardNumber: req.body.cardNumber,
      canceled: false
    });
    const savedTicket = await ticket.save();
    res.json(savedTicket);
  } catch (err) {
    res.json({ message: err });
  }  
});


//CANCEL TICKET
router.get('/cancel/:ticketId', verify, async (req, res) => {
  const user = await User.findById(req.user._id);
  try {
    var ticket = await Ticket.findById(req.params.ticketId);
    if(!ticket) return res.status(404).send('Ticket not found');
    //CHECK IF USER IS CANCELING HIS TICKET
    if(user.name !== ticket.userName) return res.status(403).send('This is not your ticket');
    
    //CHECK THAT TICKET IS NOT CANCELED    
    if(ticket.canceled === true) return res.status(403).send('Ticket is already canceled');
    
    //CHECK THAT RIDE STARTS IN LESS THAN 1 HOUR
    const ONE_HOUR = 60 * 60 * 1000;
    const anHourAway = Date.now() + ONE_HOUR;
    if(anHourAway >= ticket.departure) return res.status(403).send('You can not cancel 1 hour before departure');
    
    //UPDATE TICKET
    const result = await Ticket.updateOne({_id: req.params.ticketId}, { canceled: true });
    res.status(200).send('Ticket is canceled');
  } catch (err){
    console.log(err);
    res.json({ message: err });
  }
});

module.exports = router;