import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("users", UserSchema);
