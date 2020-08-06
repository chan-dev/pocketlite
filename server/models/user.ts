import mongoose from 'mongoose';
import { User } from '@models/user.model';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnail: {
    type: String,
  },
  provider: {
    type: String,
    require: true,
  },
});

type UserModel = User & mongoose.Document;

export default mongoose.model<UserModel>('User', userSchema);
