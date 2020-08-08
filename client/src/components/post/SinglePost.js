import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getPostById } from '../../actions/post';


// Component SinglePost is used to display one comment on page by:
// <PrivateRoute exact path="/posts/:id" component={SinglePost} /> in Routes.js

const SinglePost = ({
  getPostById,
  current_post,
  post_loading_status,
  match }) => {


  useEffect(() => {
    getPostById(match.params.id);
  }, [getPostById, match.params.id]);

  console.log(`current_post in SinglePost.js: `, current_post);


  return post_loading_status || current_post === null ? (
    <Spinner />
  ) : (
      <Fragment>
        <Link to="/posts" className="btn">
          Back To Posts
      </Link>

        <PostItem post={current_post} showActions={false} />

        <CommentForm postId={current_post._id} />

        <div className="comments">

          {current_post.comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={current_post._id} />
          ))}
        </div>

      </Fragment>
    );
};


SinglePost.propTypes = {
  // current_post: PropTypes.object.isRequired, 
  // not need to check this prop: current_post, as it is always set to null as the initial status is null. It will be updated by useEffect after the page is being loaded.
  post_loading_status: PropTypes.bool.isRequired,
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  current_post: state.post.single_post_for_edit,
  post_loading_status: state.post.loading
});

export default connect(mapStateToProps, { getPostById })(SinglePost);
