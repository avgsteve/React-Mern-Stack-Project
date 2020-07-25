/*jshint esversion: 6 */
/*jshint esversion: 8 */
/*jshint esversion: 9 */
const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth_tokenVerifier = require('../../middleware/auth_tokenVerifier');
const {
  check,
  validationResult
} = require('express-validator');
// bring in normalize_url to give us a proper url, regardless of what user entered
const normalize_url = require('normalize-url');

const checkObjectId = require('../../middleware/checkObjectId');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get('/me', auth_tokenVerifier,
  async (req, res) => {

    try {

      const profile = await Profile.findOne({
          user: req.user.id // req.user.id is created in "auth_tokenVerifier"
        })
        .populate('user', ['name', 'avatar']); // use the ObjectId in "user" field of current Profile document to find and display another document's 'name' and 'avatar' field data

      if (!profile) {
        return res.status(400).json({
          msg: 'There is no profile for this user'
        });
      }

      res.json({
        message: `The profile document of the user '${profile.user.name}' has been found!`,
        profile
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

  });


// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post('/', auth_tokenVerifier,
  // ===== 1) Verify input from req.body =====
  [
    // check status and skills are required fields
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ],

  async (req, res) => { // async function used to save, process input data and create new document

    //check if there's any error from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    // ===== 2) Save input from req.body =====

    const { // After validation check, save input data from req.body to corresponding variable names one by one
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    } = req.body;


    // ===== 3) Process input from req.body =====

    const profileFields = { // create "profileFields" obj to be used to set up the value in new user's Schema fields
      user: req.user.id, //use current req.user object passed-in from auth_tokenVerifier
      company: company,
      location: location,
      website: website && website !== '' ? normalize_url(website, {
        forceHttps: true
      }) : '', // use normalize-url package to make sure input URL is in correct format // ref: https://www.npmjs.com/package/normalize-url#api
      bio: bio,
      skills: Array.isArray(skills) ? //check if The skills is an Array
        skills // if yes, use it as it is now //
        :
        skills.split(',').map((skillItem) => ' ' + skillItem.trim()), // if it's not Array, then 1) split the input string by "," and 2) use .map() to return a new Array with results generated from 3) each trimmed and concatenated string(skillItem)
      status: status,
      githubusername: githubusername
    };

    // Build social fields object and add to profileFields
    const socialfields = {
      // Each variable refers to the object assigned with the object has corresponding name in req.body
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    };

    // Loop through the keys (property names) in socialfields Obj ex: socialfields.youtube : https:// .... get process the value with normalize_url
    for (const [key, value] of Object.entries(socialfields)) {

      if (value && value.length > 0) // if the value in current key is valid
        socialfields[key] = normalize_url(value, {
          forceHttps: true
        }); // then assign the processed value back to the original key
    }

    profileFields.social = socialfields; // assign the processed socialfields back the profileFields' .social property


    // ===== 4) Create a new profile document with processed input =====

    try {

      // find the document by id and update its fields by using $set with the profileFields object processed above
      let profile = await Profile.findOneAndUpdate( //

        { //argument #1: find document by user field's id
          user: req.user.id
        }, //

        { //argument #2: update user's document with profileFields object (will update the Schema field with corresponding name in the obj)
          $set: profileFields
        }, //

        { //argument #3:
          new: true, // flag the document as "new" document so it can trigger pre-middlewares
          upsert: true // use upsert to create a complete new document via Profile schema
        });

      //then await Profile will return a Object which has newly created document data to variable "profile"

      // ===== 5) Process input from req.body =====

      res.json({
        message: "The user's profile has been successfully created/updated!",
        profile,
      }); // send newly updated document (profile) as HTTP respoinse

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);


// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

router.get('/', async (req, res) => {

  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    const documentsArray = [];
    let obj_sortedProperty = {};

    // console.log(profiles);

    //Add new property __index_in_DocumentArray in document,
    for (var i = 0; i < profiles.length; i++) {

      //need to convert doucment to JavaScript's standard Object first
      const convertedDocument = profiles[i].toObject();

      convertedDocument.__index_in_DocumentArray = i; // Add index to new property

      // console.log('\n\n\nloop #' + i);
      // console.log(`current Obj:`, convertedDocument);

      //reorder objects properties show user can see important fields first ...
      obj_sortedProperty = Object.keys(convertedDocument).sort()
        .reduce((acc, key) => ({
          ...acc,
          [key]: convertedDocument[key]
        }), {});



      documentsArray.push(obj_sortedProperty); //push modified obj to temp Array
    }


    res.json({

      profile_document_counts: documentsArray.length,
      profiles: documentsArray // the documents have been added with new property 'count' to show the index in documents Array

    });

  } catch (err) {
    console.error("\nError: \n\n", err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id',
  // checkObjectId('user_id'),
  async (
    //  { params: {
    //     user_id
    //   }
    // },
    req,
    res) => {

    try {
      console.log(`The params id is: ${req.params.user_id}\n\n`);

      const profile = await Profile.findOne({
        // user: user_id
        user: req.params.user_id,

      }).populate('user', ['name', 'avatar']);

      if (!profile) return res.status(400).json({
        msg: 'Profile not found'
      });

      return res.json(profile);


    } catch (err) {

      console.error(err.message);

      if (err.kind == 'ObjectId') {
        return res.status(400).json({
          msg: 'Profile not found'
        });
      }

      return res.status(500).json({
        msg: 'Server error'
      });
    }
  });

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private

router.delete('/', auth_tokenVerifier, async (req, res) => {

  try {
    // // Remove user posts
    // await Post.deleteMany({
    //   user: req.user.id
    // });
    // Remove profile
    const deleteResultOfProfile = await Profile.findOneAndRemove({
      user: req.user.id //find Profile data in user's field
    });
    // Remove user
    const deleteResultOfUser = await User.findOneAndRemove({
      _id: req.user.id
    }).select('-password');

    console.log("\n\ndeleteResultOfProfile", deleteResultOfProfile);
    console.log("\n\ndeleteResultOfUser", deleteResultOfUser);

    let deleteMessage;
    if (!deleteResultOfUser && !deleteResultOfProfile) {
      deleteMessage = 'User deleted';
    }


    res.json({
      msg: deleteMessage,
      deleteResultOf_Profile: deleteResultOfProfile,
      deleteResultOf_User: deleteResultOfUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add document to experience field (Array) inside user's profile
// @access   Private
router.put(
  '/experience',
  [
    auth_tokenVerifier,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required and needs to be from the past')
      .not()
      .isEmpty()
      .custom(
        (value, { // add custom value
            req
          } //
        ) => (req.body.to ? value < req.body.to : true))
    ]
  ],

  async (req, res) => {

    // ===== 1) check if there's any error from input validation first
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        input_validation_error: "There's one or more error in the input fields",
        errors: errors.array()
      });
    }

    // ===== 2) Assign input data to the variable respectively
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };


    // ===== 3) find the profile document to which the experience data (document) will be inserted
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      });

      // ===== 4) insert new data to profile.experience (an Array for storing experience items)
      profile.experience.unshift(newExp); // insert new data into experience Array

      await profile.save(); // save the document

      res.json({
        msg: "The new data for experience field has been successfully added!",
        profile
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

  }
);


// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth_tokenVerifier,
  //
  async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({
        user: req.user.id
      });


      console.log('The documents in experiece Array:\n');
      console.log(foundProfile.experience);


      // === for setting the message in HTTP response ===
      var targetDocExists = false;
      //  foundProfile.experience // Array
      // var experienceDocumentId;

      console.log("\n\nCurrent id of the targer document is:" + req.params.exp_id + "\n\n");

      for (let experienceEntry of foundProfile.experience) {

        // // for debugging
        // console.log("\n\n\n The entries in experience field");
        // console.log(experienceEntry);
        // const entryId = experienceEntry._id;
        // console.log(typeof(req.params.exp_id));


        if (experienceEntry._id.toString() === req.params.exp_id) {
          console.log('Found the id: ', experienceEntry._id);
          targetDocExists = true;
          break;
        }
      }

      const responseMessage = targetDocExists === false ? `Can't find the document of experience item with the id: '${req.params.exp_id}'. Please make sure the id is correct` : `The experience document with id: ${req.params.exp_id} has been deleted and the profile is updated `;


      // Remove experience document from Array foundProfile.experience (which is an Array containing mutiple experience document obj)
      foundProfile.experience = foundProfile.experience.filter(
        (expEntry) => expEntry._id.toString() !== req.params.exp_id // filter the Profile results and keep only the documents those are not equal to the req.params.exp_id
      );


      await foundProfile.save(); // save


      return res.status(200).json({
        msg: responseMessage,
        foundProfile // send updated Array of experience documents
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'Server error'
      });
    }
  });



// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  auth_tokenVerifier,

  // ===== 1) check if there's any error from input validation first
  [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required and needs to be from the past')
    .not()
    .isEmpty()
    .custom(
      (value, {
        req
      }) => (req.body.to ? value < req.body.to : true)
    )
  ],


  async (req, res) => {
    const errors = validationResult(req);

    //if there's any error, send http response
    if (!errors.isEmpty()) {
      return res.status(400).json({
        input_validation_error: "There's one or more error in the input fields",
        errors: errors.array()
      });
    }

    // ===== 2) Assign input data to the variable respectively
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    // ===== 3) Find the document for profile to add new education data to
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json({
        msg: "The new data for education field has been successfully added!",
        profile
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth_tokenVerifier,
  //
  async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({
        user: req.user.id
      });


      var targetDocExists = false;
      //  foundProfile.experience // Array
      // var experienceDocumentId;

      console.log("\n\nCurrent id of the targer document is:" + req.params.edu_id + "\n\n");

      for (let educationEntry of foundProfile.education) {


        if (educationEntry._id.toString() === req.params.edu_id) {
          console.log('Found the id: ', educationEntry._id);
          targetDocExists = true;
          break;
        }
      }

      const responseMessage = targetDocExists === false ? `Can't find the document of experience item with the id: '${req.params.edu_id}'. Please make sure the id is correct` : `The education document with id: ${req.params.edu_id} has been deleted and the profile is updated `;


      // Remove education document from Array foundProfile.experience (which is an Array containing mutiple education document obj)
      foundProfile.education = foundProfile.education.filter(
        (eduEntry) => eduEntry._id.toString() !== req.params.edu_id
      );

      await foundProfile.save();

      return res.status(200).json({
        msg: responseMessage,
        foundProfile // send updated Array of education documents
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        msg: 'Server error'
      });
    }
  });

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
  try {

    // === Use Axios to send GET request to GitHub from Node.js backend

    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );

    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };


    // const gitHubResponse = await axios.get(uri, {
    //   headers
    // });

    const gitHubResponse = await axios.get(uri, {
      headers
    }).then(result => {

      console.log("\nThe result of GET request to GitHub:\n");
      console.log(result.data[0]);
      console.log("\n====================================\n");

      return res.json({
        msg: "GET request to GitHub successed!",
        data: result.data[0]
      });

      // res.json(JSON.parse(body));

    }).catch((err) => {

      console.log("\nThere's an error in GET request to GitHub:\n");
      console.log(err.response); // the response from github
      console.log("\n====================================\n");
    });

    // res
    return res.status(200).json(gitHubResponse.data);

  } catch (err) {
    console.error(err.message);
    return res.status(404).json({
      msg: 'No Github profile found'
    });
  }
});

module.exports = router;
