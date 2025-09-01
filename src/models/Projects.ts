import mongoose, { Schema } from "mongoose";
import { Project, ProjectStatus } from "../types";

const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deadline: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.PLANNING,
  },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
});

ProjectSchema.set("toJSON", {
  virtuals: true, // keep virtual fields like `id`
  versionKey: false, // removes __v
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const ProjectModel = mongoose.model<Project>("Project", ProjectSchema);
