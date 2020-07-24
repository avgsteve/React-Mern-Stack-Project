/*jshint esversion: 6 */
/*jshint esversion: 8 */
const mongoose = require('mongoose');
// middleware to check for a valid object id

const checkObjectId = (idToCheck) => (req, res, next) => {

  //check Id is valid
  if (!mongoose.Types.ObjectId.isValid(req.params[idToCheck]))

    return res.status(400).json({
      msg: 'Invalid ID'
    });
  next();
};

module.exports = checkObjectId;
