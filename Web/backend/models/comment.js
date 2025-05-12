const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {type: String, required: true, ref: 'User'},
  bookId: {type: String, required: true, ref: 'Book'},
  content: {type: String, required: true, trim: true},
  likes: {type: Number, default: 0},
  parentCommentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null},
  isEdited: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
}, {
  timestamps: true // helps in sorting and what not
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 