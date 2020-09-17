import mongoose, { DocumentQuery, Schema } from 'mongoose';
import { Bookmark } from '@models/bookmark.model';
import { validateUrl } from '../helpers/validators';

const BookSchema = new mongoose.Schema(
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

BookSchema.index({ created_at: 1, type: -1 });
BookSchema.index({ title: 'text', description: 'text' });

BookSchema.statics.searchPartial = function searchPartial({
  userId,
  q,
}: {
  userId: string;
  q: string;
}) {
  return (this as DocumentQuery<any[], any, {}>).find({
    user_id: userId,
    $or: [{ title: new RegExp(q, 'gi') }, { description: new RegExp(q, 'gi') }],
  });
};

BookSchema.statics.searchFull = function searchFull({
  userId,
  q,
}: {
  userId: string;
  q: string;
}) {
  return (this as DocumentQuery<any[], any, {}>).find({
    user_id: userId,
    $text: {
      $search: q,
      $caseSensitive: false,
    },
  });
};

// Note: we omit the id on Bookmark interface because
// id is of type string in Bookmark interface while id is of type ObjectId
// in mongoose.Document
interface BookmarkDocument extends mongoose.Document, Omit<Bookmark, 'id'> {
  // instance methods here
}

interface BookmarkModel extends mongoose.Model<BookmarkDocument> {
  // static methods here
  searchPartial(query: {
    userId: string;
    q: string;
  }): mongoose.DocumentQuery<Bookmark[], any, {}>;
}

export default mongoose.model<BookmarkDocument, BookmarkModel>(
  'Bookmark',
  BookSchema
);
