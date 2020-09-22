import mongoose, { Schema } from 'mongoose';
import { User } from '@models/user.model';

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: [true, 'googleId is required'],
  },
  displayName: {
    type: String,
    required: [true, 'displayName is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  thumbnail: {
    type: String,
  },
  provider: {
    type: String,
    require: [true, 'Provider is required'],
  },
});

type UserDocument = User & mongoose.Document;

export default mongoose.model<UserDocument>('User', UserSchema);
