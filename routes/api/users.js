/*jshint esversion: 6 */
/*jshint esversion: 8 */

const express = require( 'express' );
const router = express.Router();
const gravatar = require( 'gravatar' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const config = require( 'config' );
const {
  check, // Validation middlewares for Validation Chain. ref: https://express-validator.github.io/docs/check-api.html#checkfield-message
  validationResult // Extracts the validation errors from a request and makes them available in a Result object.  ref: https://express-validator.github.io/docs/validation-result-api.html
} = require( 'express-validator' ); // to validate incoming POST req from body
const normalize = require( 'normalize-url' );

const User = require( '../../models/User' );

// @route    POST api/users
// @desc     Register user
// @access   Public

// handles POST req and data from req.body
router.post(
  '/', //getting the data from req.body via POST request at root endpoint

  //first middlware stack (via express-validator):
  [ // use "check" instance's methods as middlewares to validate input field's value
    // ref: https://express-validator.github.io/docs/#basic-guide
    check( 'name', 'Name is required' ).not().isEmpty(),
    check( 'email', 'Please include a valid email' ).isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength( {
      min: 6
    } )
  ],

  //second middlware stack (via express-validator):
  //to get the result of validation and send HTTP response
  async ( req, res ) => { // async function for adding user with User schema

    // 1) Get validated result of req.body
    const validationResults = validationResult( req );
    console.log( "\nThe result of req.body validation:\n", validationResults );

    // 2) Check if there's any error. If so, throw an error
    if ( !validationResults.isEmpty() ) {
      return res.status( 400 ).json( {
        message: "There's one or more errors ocurred",
        errors: validationResults.array() //send a HTTP response with an array of validation errors generated from validationResults instance's method
        // ref:https://express-validator.github.io/docs/validation-result-api.html#arrayoptions
      } );
    }

    // 3) If no error, assign the properties of name, mail, password in req.body to variables
    const {
      name,
      email,
      password
    } = req.body;


    try {
      // 4) Check if email exists already by getting a user's document
      let user = await User.findOne( {
        email
      } );

      if ( user ) {
        return res
          .status( 400 )
          .json( {
            errors: [ {
              msg: 'User already exists'
            } ]
          } );
      }

      // 5) Creating a URI for avatar for user's profile image
      const avatar = normalize(
        gravatar.url( email, {
          size: '200', // s = size
          r: 'pg', // r = rating, pg is parental guidence
          d: 'mm' // d = default image, set "mp" for mystery-person
          //ref:  https://en.gravatar.com/site/implement/images/
        } ), {
          forceHttps: true
        }
      );

      // 6) create the new user data with the Schema User
      user = new User( {
        name,
        email,
        avatar,
        password
      } );

      console.log( '\nThe object of newly created user data via Schema:\n', user );

      // 7) Hashing user's password and save it to user's data
      //   a) create salt (like random value) //ref for salt: https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt
      const salt = await bcrypt.genSalt( 10 );

      // b) add hashed password to user's document object
      user.password = await bcrypt.hash( password, salt );
      console.log( '\nThe hashed password for new user:\n', user.password );

      // 8) Save new user's data to database as new document
      await user.save();

      // 9) Generate token for user as identification
      // a) store user's id as payload (data for token)
      const payload = {
        user: {
          id: user.id // user.id will be the value in the MongoDB object "ObjectID" retrived by mongoose
        }
      };

      // b) signing payload with JWT
      // jwt.sign(payload, secretSalt, options_like{expiresIn }, callback_for_generated_token(err, token)  );
      jwt.sign( // ===

        // i. the first argument obj for the content (as payload) to be encrypted and the secret code "salt"
        payload,
        // ii. the secret code or string stored in default.json for JWT
        config.get( 'jwtSecret' ),
        // iii. the options for signing data // ref:  https://github.com/auth0/node-jsonwebtoken#usage
        {
          expiresIn: '5 days'
        }, // validation length of TOKEN

        // iv. the second argument: callback function for dealing with error from JWT or sending token to user
        ( err, token ) => {
          if ( err ) throw err; //use arrow function to log an error message in console

          res.json( { //send token via http response
            message: `User data have been created. The Id is: ${user._id}`,
            token
          } );

        }
      );

    } catch ( err ) {
      console.log( "\n\nThere's an error when signing up a new user:\n" );
      console.error( err.message );
      res.status( 500 ).send( 'Server error' );
    }

  } //enf of async (req, res) => {
); //end of router.post('/',

module.exports = router;
