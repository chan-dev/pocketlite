import mongoose from 'mongoose';

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

export default mongoose.model('User', userSchema);
