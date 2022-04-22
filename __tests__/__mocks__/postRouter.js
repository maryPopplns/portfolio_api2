const express = require('express');
const router = express.Router();
const path = require('path');
const {
  getPosts,
  createPost,
  editPost,
  deletePost,
  deletePostComment,
} = require(path.join(__dirname, '../../controllers/postController'));
const { commentPost } = require(path.join(__dirname, './postController'));

// post routes
router.get('/', getPosts);
router.post('/', createPost);
router.put('/:postID', editPost);
router.delete('/:postID', deletePost);

// comment routes
router.post('/comment/:postID', commentPost);
router.delete('/comment/:postID/:commentID', deletePostComment);

module.exports = router;
