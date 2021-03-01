const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 40
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 40
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);