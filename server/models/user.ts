import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
});
