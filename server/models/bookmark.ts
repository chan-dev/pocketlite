import mongoose, { Schema } from 'mongoose';
import { Bookmark } from '@models/bookmark.model';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

type BookmarkModel = Bookmark & mongoose.Document;

export default mongoose.model<BookmarkModel>('Bookmark', bookSchema);