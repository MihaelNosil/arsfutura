const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const TicketSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 40
  },
  departure: {
    type: Date,
    required: true
  },
  arrival: {
    type: Date,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    min: 6,
    max: 40
  },
  cardNumber: {
    type: String,
    required: true,
    min: 10
  },
  canceled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Tickets', TicketSchema);