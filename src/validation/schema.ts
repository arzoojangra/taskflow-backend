import Joi from "joi";
import { TaskStatus, TaskPriority, ProjectStatus, UserRole } from "../types";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
});

export const projectSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  deadline: Joi.number().required(),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional(),
  owner_id: Joi.string().required(),
});

export const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional(),
  assignee_id: Joi.string().optional(),
  estimated_hours: Joi.number().min(0).optional(),
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .optional(),
});

export const taskStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
});

export const dependencySchema = Joi.object({
  depends_on_task_id: Joi.string().required(),
});
