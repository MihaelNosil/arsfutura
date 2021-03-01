const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const RideSchema = new Schema({
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
  space: {
    type: Number,
    min: 1,
    required: true
  },
  companyName: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Rides', RideSchema);