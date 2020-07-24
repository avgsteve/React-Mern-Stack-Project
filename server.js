/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require('express');
const connectDB = require('./config/db'); // use mongoose to connect to database
const path = require('path');

const app = express();

connectDB(); // Connect Database


// Init Middleware
app.use(express.json()); // for parsing incoming requests with JSON payloads
//No need to use app.use(express.json( { extended: false } ));
//ref:  https://stackoverflow.com/questions/57762864/meaning-of-argument-in-express-json-extended-false

//for testing res data in POSTMAN
app.get('/', (req, res) => res.send("API running!"));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/posts', require('./routes/api/posts'));

// // Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));
//
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
