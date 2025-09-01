// src/controllers/TaskController.ts
import { Request, Response } from "express";
import {
  taskSchema,
  taskStatusSchema,
  dependencySchema,
} from "../validation/schema";
import TaskService from "../services/taskService";

const TaskController = {
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = taskSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const task = await TaskService.createTask({
        ...value,
        project_id: req.params.id,
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await TaskService.getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = taskSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const task = await TaskService.updateTask(req.params.id, value);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = taskStatusSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const result = await TaskService.updateTaskStatus(
        req.params.id,
        value.status
      );

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.json(result.task);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const success = await TaskService.deleteTask(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async addDependency(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = dependencySchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const result = await TaskService.addDependency(
        req.params.id,
        value.depends_on_task_id
      );

      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.status(201).json(result.dependency);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async removeDependency(req: Request, res: Response): Promise<void> {
    try {
      const success = await TaskService.removeDependency(
        req.params.taskId,
        req.params.depId
      );
      if (!success) {
        res.status(404).json({ error: "Dependency not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getTaskDependencies(req: Request, res: Response): Promise<void> {
    try {
      const dependencies = await TaskService.getTaskDependencies(req.params.id);
      res.json(dependencies);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getTasksBlocking(req: Request, res: Response): Promise<void> {
    try {
      const blocking = await TaskService.getTasksBlockedBy(req.params.id);
      res.json(blocking);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getTasksByProjectId(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await TaskService.getTasksByProjectId(req.params.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default TaskController;