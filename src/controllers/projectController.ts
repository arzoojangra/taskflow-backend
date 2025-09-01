// src/controllers/ProjectController.ts
import { Request, Response } from "express";
import ProjectService from "../services/projectService";
import { projectSchema } from "../validation/schema";

const ProjectController = {
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = projectSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const project = await ProjectService.createProject({
        ...value,
      });

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await ProjectService.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await ProjectService.getProjectWithTasks(req.params.id);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = projectSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const project = await ProjectService.updateProject(req.params.id, value);
      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const success = await ProjectService.deleteProject(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getProgress(req: Request, res: Response): Promise<void> {
    try {
      const progress = await ProjectService.calculateProgress(req.params.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getCriticalPath(req: Request, res: Response): Promise<void> {
    try {
      const criticalPath = await ProjectService.getCriticalPath(req.params.id);
      res.json({ criticalPath });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default ProjectController;
