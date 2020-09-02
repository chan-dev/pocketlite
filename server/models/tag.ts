import mongoose, { Schema } from 'mongoose';
import { Tag } from '@models/tag.model';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user_id is required'],
  },
});

tagSchema.index({ name: 1, user_id: 1 }, { unique: true });

type TagModel = Tag & mongoose.Document;

export default mongoose.model<TagModel>('Tag', tagSchema);
