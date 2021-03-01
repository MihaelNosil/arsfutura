const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');

//Middleware
app.use(bodyParser.json());

//Route middleware
const rideRoute = require('./routes/rides'); 
app.use('/api/rides', rideRoute);
const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);
const ticketRoute = require('./routes/ticket');
app.use('/api/tickets', ticketRoute);


//HOME PAGE
app.get('/', (req, res) => {
  res.send('Sustav za Kupnju Karata');
});


//connect to db
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000, () => console.log('Server runing')),
  console.log('Conected to db!'))
  .catch((err) => console.log(err));



