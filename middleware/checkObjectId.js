/*jshint esversion: 6 */
/*jshint esversion: 8 */
const mongoose = require('mongoose');
// middleware to check for a valid object id

const checkObjectId = (idToCheck) => (req, res, next) => {

  //check if the Id URI is valid by using mongoose.Types.ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))
    //ref:  https://mongoosejs.com/docs/api.html#mongoose_Mongoose-isValidObjectId
    //ref:  https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    //ref:  https://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html#objectid-isvalid

    return res.status(400).json({
      msg: 'Invalid ID'
    });
  next();
};

module.exports = checkObjectId;
