const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: { type: String, required: true },
  likes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Comment', commentSchema);
