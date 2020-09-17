import mongoose, { DocumentQuery, Schema } from 'mongoose';
import mongoose_delete from 'mongoose-delete';

import { Bookmark } from '@models/bookmark.model';
import { validateUrl } from '../helpers/validators';

const BookmarkSchema = new mongoose.Schema(
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
        message: () => `url is not valid`,
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

BookmarkSchema.plugin(mongoose_delete);

BookmarkSchema.index({ created_at: 1, type: -1 });
BookmarkSchema.index({ title: 'text', description: 'text' });

type BookmarkDocumentQuery<
  T extends mongoose.Document = BookmarkDocument
> = DocumentQuery<T[], T>;

// we created this type just so we can reference the bookmarkQueryHelpers
// on its own body; otherwise, it will be a circular type error
interface BookmarkQueryHelper extends bookmarkQueryHelperType {}

let bookmarkQueryHelpers = {
  byUser(this: BookmarkDocumentQuery & BookmarkQueryHelper, userId: string) {
    return this.where({
      user_id: userId,
    });
  },

  findArchived(
    this: BookmarkDocumentQuery & BookmarkQueryHelper,
    archived: boolean
  ) {
    return this.where({
      deleted: archived,
    });
  },
};

let bookmarkStaticMethods = {
  searchPartial(
    this: BookmarkModel,
    userId: string,
    q: string,
    archived: boolean
  ) {
    return this.find({
      $or: [
        { title: new RegExp(q, 'gi') },
        { description: new RegExp(q, 'gi') },
      ],
    })
      .byUser(userId)
      .findArchived(archived);
  },

  searchFull(
    this: BookmarkModel,
    userId: string,
    q: string,
    archived: boolean
  ) {
    return this.find({
      user_id: userId,
      $text: {
        $search: q,
        $caseSensitive: false,
      },
    })
      .byUser(userId)
      .findArchived(archived);
  },
};

let bookmarkInstanceMethods = {};

type bookmarkStaticType = typeof bookmarkStaticMethods;
type bookmarkQueryHelperType = typeof bookmarkQueryHelpers;
type bookmarkInstanceType = typeof bookmarkInstanceMethods;

BookmarkSchema.query = bookmarkQueryHelpers;
BookmarkSchema.statics = bookmarkStaticMethods;

// Note: we omit the id on Bookmark interface because
// id is of type string in Bookmark interface while id is of type ObjectId
// in mongoose.Document

// prettier-ignore
interface BookmarkDocument extends mongoose.Document, Omit<Bookmark, 'id'>, bookmarkInstanceType {}

// prettier-ignore
interface BookmarkModel extends mongoose.Model<BookmarkDocument, bookmarkQueryHelperType>, bookmarkStaticType {}

export default mongoose.model<BookmarkDocument, BookmarkModel>(
  'Bookmark',
  BookmarkSchema
);
