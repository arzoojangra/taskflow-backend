import mongoose, { Schema } from "mongoose";
import { TaskDependency } from "../types";

const TaskDependencySchema = new Schema<TaskDependency>(
  {
    task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    depends_on_task_id: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensuring a task cannot depend on itself and prevent duplicate dependencies
TaskDependencySchema.index(
  { task_id: 1, depends_on_task_id: 1 },
  { unique: true }
);

export const TaskDependencyModel = mongoose.model<TaskDependency>(
  "TaskDependency",
  TaskDependencySchema
);
