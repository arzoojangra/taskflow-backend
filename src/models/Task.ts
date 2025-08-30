import mongoose, { Schema } from "mongoose";
import { Task, TaskStatus, TaskPriority } from "../types";

const TaskSchema = new Schema<Task>({
  project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  },
  assignee_id: { type: Schema.Types.ObjectId, ref: "User" },
  estimated_hours: { type: Number, min: 0 },
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
});

export const TaskModel = mongoose.model<Task>("Task", TaskSchema);
