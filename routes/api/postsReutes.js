const express = require( 'express' );
const router = express.Router();
const {
  check,
  validationResult
} = require( 'express-validator' );
const auth_tokenVerifier = require( '../../middleware/auth_tokenVerifier' );

const Post = require( '../../models/Post' );
const User = require( '../../models/User' );
const checkObjectId = require( '../../middleware/checkObjectId' );


// @route    POST api/posts
// @desc     Create a post
// @access   Private

router.post( '/', [ auth_tokenVerifier,
    [ check( 'text', 'Text is required' ).not().isEmpty() ]
  ],

  async ( req, res ) => { // 3rd argument: callback function create POST req to make new document for user's post

    const errors = validationResult( req );

    if ( !errors.isEmpty() ) {
      return res.status( 400 ).json( {
        msg: "Fail to create new post",
        errors: errors.array()
      } );
    }

    try {
      const user = await User.findById( req.user.id ).select( '-password' ); //get user's data ex: avatar link to be added to post document

      const newPost = new Post( {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      } );

      const post = await newPost.save();

      res.json( {
        msg: "New post has been successfully created!",
        post
      } );
    } catch ( err ) {
      console.error( err.message );
      res.status( 500 ).send( 'Server Error' );
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get( '/', auth_tokenVerifier,
  async ( req, res ) => {
    try {
      const posts = await Post.find().sort( {
        date: -1 // descending order (most recent first)
      } );
      res.json( {
        msg: "Getting all post is successful",
        posts_count: posts.length,
        posts
      } );
    } catch ( err ) {
      console.error( err.message );
      res.status( 500 ).send( {
        msg: "There's an error fetching all posts",
        error: err
      } );
    }
  } );


// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get( '/:id', [ auth_tokenVerifier,
  checkObjectId( 'id' )
], async ( req, res ) => {

  try {
    const post = await Post.findById( req.params.id ); //find documents in posts collection

    if ( !post ) {
      return res.status( 404 ).json( {
        msg: 'Post not found'
      } );
    }

    res.json( post );
  } catch ( err ) {
    console.error( err.message );

    res.status( 500 ).send( 'Server Error' );
  }
} );


// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete( '/:id', [ auth_tokenVerifier, checkObjectId( 'id' ) ], async ( req, res ) => {
  try {
    const post = await Post.findById( req.params.id );

    if ( !post ) {
      return res.status( 404 ).json( {
        msg: 'Post not found'
      } );
    }

    // Check user who wants to delete the post is the user who create the post
    if ( post.user.toString() !== req.user.id ) {
      return res.status( 401 ).json( {
        msg: 'User not authorized'
      } );
    }

    await post.remove();

    res.json( {
      msg: 'Post removed'
    } );
  } catch ( err ) {
    console.error( err.message );

    res.status( 500 ).send( 'Server Error' );
  }
} );



// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private

router.put( '/like/:id', [ auth_tokenVerifier, // Like a post

  checkObjectId( 'id' )
], async ( req, res ) => {
  try {
    const post = await Post.findById( req.params.id );

    // Check if the post has already been liked

    if ( post.likes.filter( //use filter to find the like item which has the user id matches the req.params.id

        likeItem => likeItem.user.toString() === req.user.id ).length > 0 ) //if the index length is greater than 0, means there's a matched result returned from the filter()

    {
      return res.status( 400 ).json( {
        msg: 'Post was already liked before',
      } );
    }

    // // Another way to check if the post has already been liked
    // if (post.likes.some(
    //     //Array.some(callback(element)) returns Boolean
    //     like => like.user.toString() === req.user.id)) {
    //
    //   return res.status(400).json({
    //     msg: 'Post was already liked before'
    //   });
    // }


    post.likes.unshift( {
      user: req.user.id,
      user_name: req.user.id
    } );

    await post.save();

    return res.json( {
      msg: "Now you have liked this post",
      likes_count: post.likes.length,
      likes_on_the_post: post.likes,
    } );
  } catch ( err ) {
    console.error( err.message );
    console.log( err );
    res.status( 500 ).send( 'Server Error' );
  }
} );

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private


router.put( '/unlike/:id', [ auth_tokenVerifier, //Unlike a post
  checkObjectId( 'id' )
], async ( req, res ) => {
  try {
    const post = await Post.findById( req.params.id );


    if ( post.likes.filter( //use filter to find the like item which has the user id matches the req.params.id

        likeItem => likeItem.user.toString() === req.user.id ).length === 0 ) // if the index length is 0, means no result returned from the filter()

    {
      return res.status( 400 ).json( {
        msg: "Post hasn't been liked before. You can't unlike this post",
      } );
    }


    // // Check if the post has not yet been liked
    // if (!post.likes.some(like => like.user.toString() === req.user.id)) {
    //   return res.status(400).json({
    //     msg: 'Post has not yet been liked'
    //   });
    // }

    // remove the like
    // === method 1) return a new array without the like from this user

    // a) First find out the location of the user's id in like Array
    const removeIndex = post.likes.map(

        likeItems => likeItems.user.toString() //likeItems.user is the id of user

      ) // returns Array containing by map()
      .indexOf( req.user.id ); // then find the index of target user's id

    // b) Then remove the item (of user's like) from likes Array
    post.likes.splice( removeIndex, 1 );


    // post.likes = post.likes.filter(
    //   ({
    //     user
    //   }) => user.toString() !== req.user.id
    // );

    await post.save();

    return res.json( {
      msg: "You have now unliked the post!",
      likes_count: post.likes.length,
      likes_on_the_post: post.likes,
    } );
  } catch ( err ) {
    console.error( err.message );
    res.status( 500 ).send( 'Server Error' );
  }
} );


// ==== COMMENING A POST ====

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private

router.post( '/comment/:id', //Comment on a post
  [
    auth_tokenVerifier,
    checkObjectId( 'id' ),
    [ check( 'text', 'Text is required' ).not().isEmpty() ]
  ],

  async ( req, res ) => {

    // Check if there's any error from validationResult
    const errors = validationResult( req );

    if ( !errors.isEmpty() ) {
      return res.status( 400 ).json( { // return error data if the errors Array from validationResult(req) is not empty
        errors: errors.array()
      } );
    }

    try {
      const user = await User.findById( req.user.id ).select( '-password' );
      const post = await Post.findById( req.params.id );

      const newComment = { // Get comment content from req.body.text
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar
      };

      post.comments.unshift( newComment ); // add newComment to .comments Array

      await post.save();

      res.status( 200 ).json( {
        msg: "New comment has been added to the post",
        original_post: post,
        comment_counts: post.comments.length,
        comments: post.comments
      } );

    } catch ( err ) {
      console.error( err.message );
      res.status( 500 ).send( 'Server Error' );
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment from a post
// @access   Private
router.delete( '/comment/:id/:comment_id', auth_tokenVerifier,

  async ( req, res ) => {
    try {
      const post = await Post.findById( req.params.id );

      // Pull out and loop through comments from Post document
      const comment = post.comments.find(
        //Then find if there's any comment has the id matched the req.params.id
        comment => comment.id === req.params.comment_id
      );

      // Make sure comment exists
      if ( !comment ) {
        return res.status( 404 ).json( {
          msg: 'Comment does not exist'
        } );
      }
      // Check user. Only the user in the comment (means the user is author) can delete the comment
      if ( comment.user.toString() !== req.user.id ) {
        return res.status( 401 ).json( {
          msg: 'User not authorized'
        } );
      }

      //use the filtered comments Array (from post.comments) to update the post.comments
      post.comments = post.comments.filter(
        ( {
          id
        } ) => id !== req.params.comment_id // all the comments which are not matched will be returned as the items to the new array
      );

      await post.save(); // the updated post.comments will be saved

      // create snippet of the deleted comment to be send as part of HTTP response message
      const deleted_post_snippet = post.text.slice( 0, 20 );

      return res.status( 200 ).json( {
        msg: `The comment: ''${deleted_post_snippet} ...'' has been deleted from the post`,
        comment_counts: post.comments.length,
        comments: post.comments
      } );

    } catch ( err ) {
      console.log( "There's an error while creating a new comment in the post: ", err );
      return res.status( 500 ).send( 'Server Error' );
    }
  } );

module.exports = router;
