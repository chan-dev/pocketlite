import mongoose from 'mongoose';
import { User } from '@models/user.model';

const userSchema = new mongoose.Schema({
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

type UserModel = User & mongoose.Document;

export default mongoose.model<UserModel>('User', userSchema);
