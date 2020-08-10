/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require('express');
const connectDB = require('./config/connectToDB'); // use mongoose to connect to database
// const path = require( 'path' );
const morgan = require('morgan');
const chalk = require('chalk');

const app = express();

const morganMiddleware = morgan(function (tokens, req, res) {
  return [
    '\n',
    chalk.hex('#ff4757').bold('Req Log:'),
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    // chalk.hex('#ffb142').bold(tokens.status(req, res)),
    chalk.hex('#ff5252').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
    chalk.hex('#f78fb3').bold('@ ' + tokens.date(req, res)),
    // chalk.yellow(tokens['remote-addr'](req, res)),
    chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
    // chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
    '',
  ].join(' ');
  //ref:  https://stackoverflow.com/questions/36284015/morgan-node-js-coloring-status-code-as-in-dev-while-using-custom-format
  //ref: Color not displayed: https://github.com/expressjs/morgan/issues/186
});

// app.use(morgan('dev'));
app.use(morganMiddleware);
// options for morgan:  https://www.npmjs.com/package/morgan#options


try {
  connectDB(); // Connect Database

} catch (error) {
  console.log("There's an error when establishing connection to MongoDB:", error);
}


// Init Middleware
app.use(express.json()); // for parsing incoming requests with JSON payloads
//No need to use app.use(express.json( { extended: false } ));
//ref:  https://stackoverflow.com/questions/57762864/meaning-of-argument-in-express-json-extended-false

//for testing res data in POSTMAN
app.get('/', (req, res) => res.send("API running!"));

// Define Routes

app.use('/api/users', require('./routes/api/users'));

app.use('/api/auth', require('./routes/api/authRoutes'));
// GET@/api/auth for user login,
// POST@/api/auth for getting user'd data from document

app.use('/api/profile', require('./routes/api/profileReutes'));
// GET@/api/profile/me for user's profile

app.use('/api/posts', require('./routes/api/postsReutes'));

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
