import mongoose, { Schema } from "mongoose";
import { User, UserRole } from "../types";

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.DEVELOPER,
  },
  password: { type: String, required: true },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
});

export const UserModel = mongoose.model<User>("User", UserSchema);
