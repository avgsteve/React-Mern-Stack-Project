/*jshint esversion: 6 */
/*jshint esversion: 8 */
const jwt = require( 'jsonwebtoken' );
const config = require( 'config' );

// this middleware auth.js is used to verify the token to protect API routes
module.exports = function( req, res, next ) {

  // Get token from header (the token included in header)
  const token = req.header( 'x-auth-token' );

  // Check if not token
  if ( !token ) {
    return res.status( 401 ).json( {
      msg: 'No token found in header, authorization denied'
    } );
  }

  // Verify token using jwt.verify()

  try { // use try block as jwt.verify() will return Promise

    // jwt.verify(token, secretOrPublicKey, [options, callback for decoded results])
    jwt.verify(
      token, // token data from header
      config.get( 'jwtSecret' ), //secretOrPublicKey

      ( error, decoded ) => { // function for processing the decoded token data
        //note: (Asynchronous) If a callback is supplied, function acts asynchronously. ref:  https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback

        // verification failed!
        if ( error ) {
          return res.status( 401 ).json( {
            msg: 'Token is not valid',
            errorMessageFromJWT: error
          } );

          // verification successed!
        } else {

          req.user = decoded.user; // which is the object { id: user.id }. So use req.user.id to get the user's Id

          next(); // move on the next middleware with req.user.id data

        }

      } );

  } catch ( err ) {

    console.error( 'something wrong with auth middleware' );
    res.status( 500 ).json( {
      msg: 'Server Error'

    } );
  }

}; //end of module.exports = function(req, res, next) {
