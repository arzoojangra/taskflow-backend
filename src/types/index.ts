import mongoose from "mongoose";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
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
  ADMIN = "admin",
  MANAGER = "manager",
  DEVELOPER = "developer",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner_id: mongoose.Types.ObjectId | string;
  deadline: number;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Task {
  _id: string;
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
  _id: string;
  task_id: mongoose.Types.ObjectId | string;
  depends_on_task_id: mongoose.Types.ObjectId | string;
  createdAt: number;
}
