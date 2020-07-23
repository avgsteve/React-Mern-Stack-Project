/*jshint esversion: 6 */
/*jshint esversion: 8 */
const mongoose = require('mongoose');
const config = require('config'); // use config package to get configuration for
const dbURI = config.get('mongoURI'); //to the URI from the key "mongoURI" from the file: default.json

console.log(`\n(from db.js) Establishing connection to MongoDB database now ...\n`);

//export function to establishing connection to DB
const connectDB = async () => {

  try {

    const connectionInfo = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('\n\nMongoDB Connected...\n\nThe detail of connection is:');
    console.log(connectionInfo);

  } catch (err) {

    console.log(`\nThere's an error while trying to connect the MongoDB\n`);
    console.error(err.message);

    // Exit Node.js's process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
