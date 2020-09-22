import mongoose, { Schema } from 'mongoose';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';

const BookmarkFavoriteSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user_id id is required'],
  },
  bookmark_id: {
    type: Schema.Types.ObjectId,
    ref: 'Bookmark',
    required: [true, 'bookmark_id is required'],
  },
});

BookmarkFavoriteSchema.index({ user_id: 1, bookmark_id: 1 }, { unique: true });

type BookmarkFavoriteDocument = BookmarkFavorite & mongoose.Document;

export default mongoose.model<BookmarkFavoriteDocument>(
  'BookmarkFavorite',
  BookmarkFavoriteSchema
);
