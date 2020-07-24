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
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
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

    try {
      let user = await User.findOne({
        email
      });

      if (!user) {
        return res
          .status(400)
          .json({
            errors: [{
              msg: 'Invalid Credentials'
            }]
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({
            errors: [{
              msg: 'Invalid Credentials'
            }]
          });
      }

      const payload = {
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
