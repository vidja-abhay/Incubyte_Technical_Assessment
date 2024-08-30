import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  publication_year: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true  // true means available, false means not available
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  person_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', BookSchema);

export default Book;
