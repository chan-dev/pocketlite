import mongoose, { Schema } from 'mongoose';
import { Bookmark } from '@models/bookmark.model';
import { validateUrl } from '../helpers/validators';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: [true, 'url is required'],
      unique: true,
      validate: {
        validator: validateUrl,
        message: props => `url is not valid`,
      },
    },
    domain: {
      type: String,
      required: [true, 'domain is required'],
    },
    canonicalUrl: {
      type: String,
      default: '',
    },
    followsRedirect: {
      type: Boolean,
    },
    contentInMarkdown: {
      type: String,
      default: '',
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
      required: [true, 'user_id is required'],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

bookSchema.index({ created_at: 1, type: -1 });

type BookmarkModel = Bookmark & mongoose.Document;

export default mongoose.model<BookmarkModel>('Bookmark', bookSchema);
