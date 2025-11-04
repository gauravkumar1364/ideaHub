const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  replies: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const EditHistorySchema = new mongoose.Schema({
  editedAt: { type: Date, default: Date.now },
  changes: String
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  problemStatement: { type: String, default: '' },
  solutionOverview: { type: String, default: '' },
  targetAudience: { type: String, default: '' },
  impact: { type: String, default: '' },
  category: { type: String, enum: ['Tech', 'Health', 'Sustainability', 'Education', 'Finance', 'Other'], default: 'Tech' },
  tags: [{ type: String }],
  imageUrl: { type: String, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
  editHistory: [EditHistorySchema],
  ranking: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Calculate ranking based on upvotes, downvotes, comments, and time decay
PostSchema.methods.calculateRanking = function() {
  const upvoteWeight = this.upvotes.length * 10;
  const downvoteWeight = this.downvotes.length * -5;
  const commentWeight = this.comments.length * 2;
  const timeDecay = Math.log(1 + (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  this.ranking = Math.max(0, (upvoteWeight + downvoteWeight + commentWeight) / (1 + timeDecay / 10));
  return this.ranking;
};

PostSchema.pre('save', function(next) {
  this.calculateRanking();
  next();
});

module.exports = mongoose.model('Post', PostSchema);
