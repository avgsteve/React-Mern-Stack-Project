/*jshint esversion: 6 */
/*jshint esversion: 8 */
const mongoose = require( 'mongoose' );

const UserSchema = new mongoose.Schema( {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: { //user's profile image
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
} );

module.exports = mongoose.model( 'user', UserSchema );
