// src/routes/projects.ts
import { Router } from "express";
import ProjectController from "../controllers/projectController";

const router = Router();

router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getProjects);
router.get("/:id", ProjectController.getProject);
router.put("/:id", ProjectController.updateProject);
router.delete("/:id", ProjectController.deleteProject);
router.get("/:id/progress", ProjectController.getProgress);
router.get("/:id/critical-path", ProjectController.getCriticalPath);

export default router;
