import mongoose, { Schema } from 'mongoose';
import mongoose_delete, {
  SoftDeleteInterface,
  SoftDeleteModel,
} from 'mongoose-delete';

import { Bookmark } from '@models/bookmark.model';
import { validateUrl } from '../helpers/validators';

export interface BookmarkOptions {
  userId: string;
  archived: boolean;
  q: string;
}

export interface PaginateOptions extends BookmarkOptions {
  offset: number;
  limit: number;
  sortBy: string;
  sortOrder: 1 | -1 | 'asc' | 'desc';
  favorited: boolean;
}

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

BookmarkSchema.index({ created_at: 1, type: -1 });
BookmarkSchema.index({ title: 'text', description: 'text' });

export type BookmarkDocumentQuery<
  T extends mongoose.Document = BookmarkDocument
> = mongoose.DocumentQuery<T[], T>;

// we created this type just so we can reference the bookmarkQueryHelpers
// within its own definition; otherwise, it will be a circular type error
interface BookmarkQueryHelper extends bookmarkQueryHelpersType {}

// Notice the "this" keyword on the follow objects
// In typescript, the this keyword as the first parameter basically means
// that at compile-time we expect the "this" reference to point to
// BookmarkDocumentQuery & BookmarkQueryHelper type for typing to work
// https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters

// query helpers are used for chaining so we expect "this" to point to
// the existing document query(BookmarkDocumentQuery) w/c may have
// existing query helpers(BookmarkQueryHelper)
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

// static methods are attached to the Model itself
// so "this" needs to refer to our custom model (BookmarkModel)
let bookmarkStaticMethods = {
  searchPartial(this: BookmarkModel, options: BookmarkOptions) {
    const { q, userId, archived } = options;
    return this.find({
      $or: [
        { title: new RegExp(q, 'gi') },
        { description: new RegExp(q, 'gi') },
      ],
    })
      .byUser(userId)
      .findArchived(archived);
  },

  searchFull(this: BookmarkModel, options: BookmarkOptions) {
    const { userId, q, archived } = options;
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

  paginate(this: BookmarkModel, options: PaginateOptions) {
    const { userId, offset, limit, sortBy, sortOrder, archived } = options;
    return this.find()
      .byUser(userId)
      .findArchived(archived)
      .sort({ [sortBy]: sortOrder })
      .skip(offset)
      .limit(limit);
  },
};

// "this" in instance methods need to refer to our custom Document (BookmarkDocument)
let bookmarkInstanceMethods = {};

BookmarkSchema.query = bookmarkQueryHelpers;
BookmarkSchema.statics = bookmarkStaticMethods;
BookmarkSchema.methods = bookmarkInstanceMethods;

// create type aliases for custom static, instance and query helper methods
type bookmarkStaticType = typeof bookmarkStaticMethods;
type bookmarkQueryHelpersType = typeof bookmarkQueryHelpers;
type bookmarkInstanceType = typeof bookmarkInstanceMethods;

// plugin must be called after we add our own static, instance or query
// helpers methods since plugins override those
BookmarkSchema.plugin(mongoose_delete);

// we omit the id on Bookmark interface because
// id is of type string in Bookmark interface while id is of type ObjectId
// in mongoose.Document

// notice that our custom Document and Model respectively extends SoftDeleteInterface and SoftDeleteModal
// because they must follow the same signature of the plugin for typescript to correctly infer
// the types by reading the defition files
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mongoose-delete/index.d.ts#L23

// prettier-ignore
export interface BookmarkDocument extends mongoose.Document,
  SoftDeleteInterface,
  Omit<Bookmark, 'id'>,
  bookmarkInstanceType {}

// NOTE:
// we provide defaults for mongoose.Document and QueryHelpers
// so we don't have to provide them explicitly when we use BookmarkModel

// prettier-ignore
export interface BookmarkModel<T extends mongoose.Document = BookmarkDocument, QueryHelpers = bookmarkQueryHelpersType> extends mongoose.Model<T, QueryHelpers>,
  SoftDeleteModel<T, QueryHelpers>,
  bookmarkStaticType {
  }

export default mongoose.model<BookmarkDocument, BookmarkModel>(
  'Bookmark',
  BookmarkSchema
);
