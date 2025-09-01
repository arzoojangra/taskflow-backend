import mongoose from "mongoose";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  BLOCKED = "blocked",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum ProjectStatus {
  PLANNING = "planning",
  ACTIVE = "active",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum UserRole {
  MANAGER = "manager",
  DEVELOPER = "developer",
}

export interface User {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  owner_id: mongoose.Types.ObjectId | string;
  deadline: number;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  id: mongoose.Types.ObjectId;
  project_id: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id?: string;
  estimated_hours?: number;
  createdAt: number;
  updatedAt: number;
}

export interface TaskDependency {
  id: mongoose.Types.ObjectId;
  task_id: mongoose.Types.ObjectId | string;
  depends_on_task_id: mongoose.Types.ObjectId | string;
  createdAt: number;
}
