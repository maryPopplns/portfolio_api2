const express = require('express');
const router = express.Router();
const path = require('path');
const {
  getPosts,
  createPost,
  editPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deletePostComment,
  likePostComment,
  unlikePostComment,
} = require(path.join(__dirname, '../controllers/postController'));

// post routes
router.get('/', getPosts);
router.post('/', createPost);
router.put('/:postID', editPost);
router.delete('/:postID', deletePost);

// like routes
router.put('/like/:postID', likePost);
router.put('/unlike/:postID', unlikePost);
router.put('/like/:postID/:commentID', likePostComment);
router.put('/unlike/:postID/:commentID', unlikePostComment);

// comment routes
router.post('/comment/:postID', commentPost);
router.delete('/comment/:postID/:commentID', deletePostComment);

module.exports = router;
