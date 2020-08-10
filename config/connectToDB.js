/*jshint esversion: 6 */
/*jshint esversion: 8 */
const mongoose = require('mongoose');
const config = require('config'); // use config package to get configuration for
const dbURI = config.get('mongoURI'); //to the URI from the key "mongoURI" from the file: default.json

console.log(`\n(from db.js) Establishing connection to MongoDB database now ...\n`);


//export function to establishing connection to DB
const connectDB = async () => {

  // const serverOptions = {
  //   serverSelectionTimeoutMS: 10000,
  //   socketTimeoutMS: 2000,
  //   keepAlive: true,
  //   // reconnectTries: 30
  //   connected: true,
  // };

  try {

    const connectionInfo = await mongoose.connect(dbURI, {
      // serverOptions,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false, // use it to fix deprecated warning bug in mongoose
      useUnifiedTopology: true,
    }
    );


    // connectionInfo.on('connected', () => {
    //   console.log('connected to mongodb');
    // });

    // connectionInfo.on('disconnected', () => {
    //   console.log('connection disconnected');
    // });

    //if connection is successful and has reached to database
    if (connectionInfo.connections[0].db) {

      console.log('\n\nMongoDB Connected...');
      console.log("\nThe detail of connection is:\n\n", connectionInfo.connections[0].db.s.namespace);
    }

  } catch (err) {


    if (err.code === "ENODATA") console.log("\nConnection to Mongodb has failed due to incorrent URI");

    // console.log(`\nThere's an error while trying to connect the MongoDB:`);
    // console.log('\nThe error code: \n', err.code);

    console.log('\nThe full error log: \n', err);

    // Exit Node.js's process with failure
    // process.exit( 1 );
  }
};

module.exports = connectDB;
