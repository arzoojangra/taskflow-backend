import Joi from "joi";
import { TaskStatus, TaskPriority, ProjectStatus, UserRole } from "../types";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
  password: Joi.string().min(6).required(),
});

export const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  deadline: Joi.date().iso().required(),
  status: Joi.string()
    .valid(...Object.values(ProjectStatus))
    .optional(),
});

export const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .optional(),
  assignee_id: Joi.string().optional(),
  estimated_hours: Joi.number().min(0).optional(),
});

export const taskStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TaskStatus))
    .required(),
});

export const dependencySchema = Joi.object({
  depends_on_task_id: Joi.string().required(),
});
