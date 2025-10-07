import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher',
    required: true,
  },
  publish: { type: Boolean, required: true }
}, { minimize: false });

bookSchema.virtual('reviews', {
  ref: 'reviewmodel',
  localField: '_id',
  foreignField: 'bookId',
});



bookSchema.set('toObject', { virtuals: true });
bookSchema.set('toJSON', { virtuals: true });

const bookmodel = mongoose.models.book || mongoose.model('book', bookSchema);
export default bookmodel;