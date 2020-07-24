/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth_tokenVerifier = require('../../middleware/auth_tokenVerifier'); // use auth.js to project
const jwt = require('jsonwebtoken');
const config = require('config');
const {
  check,
  validationResult
} = require('express-validator');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
// from server.js --> app.use('/api/auth', require('./routes/api/authRoutes'));

// Route for getting user's data after the token is verified
router.get('/',
  auth_tokenVerifier, // verify user's (browser) http token  with JWT
  // (req, res) => res.send("Auth enabled"), // this middlware will be executed if only the auth_tokenVerifier is cleared for passing
  // // test the middleware "auth_tokenVerifier" with POSTMAN @ GET http://localhost:5000/api/auth

  async (req, res) => { // send user's data after the token is successfully verified
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user); // send user's data as json format via HTTP response
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  } //
);


// @route    POST api/auth
// @desc     Authenticate user & get token (USER LOG IN)
// @access   Public
// from server.js --> app.use('/api/auth', require('./routes/api/authRoutes'));

// Route for verify user's password and send token if
router.post(
  '/',
  // ====== 1) Check email and password from req.body ======
  [ //use express-validator to validate the content from req.body
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists() // makes password field can't be empty
  ],
  async (req, res) => { //get email and password from req.body and verify user
    // 1) Check if there's any error from the validation process
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      email,
      password
    } = req.body;

    // ====== 2) Check user's document ======

    try { // If no error exists in validation , find user's document
      let user = await User.findOne({
        email
      });

      if (!user) { // Check if the user with input email exists

        return res.status(400).json( // if user's document with the email doesn't exist
          {
            errors: [{
              msg: "Invalid Credentials. User's email or password is incorrect"
            }]
          } // obj sent as HTTP response from server
        );
      }

      // ====== 3) Verify user's password ======
      // Use bcrypt.compare() to verify user's hashed password in user's document
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({
            errors: [{
              msg: "Invalid Credentials. User's email or password is incorrect"
            }]
          });
      }

      // ====== 4) Generate and send token ======
      const payload = { // create payload for generating token to be sent to user
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'), {
          expiresIn: '5 days'
        },
        (err, token) => {

          if (err) throw err;
          res.json({
            msg: `User '${user.name}' has successful logged-in`,
            token
          });

        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
