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
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
});

UserSchema.set("toJSON", {
  virtuals: true, // keep virtual fields like `id`
  versionKey: false, // removes __v
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const UserModel = mongoose.model<User>("User", UserSchema);
