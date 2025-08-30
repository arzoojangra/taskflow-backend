// src/routes/projects.ts
import { Router } from "express";
import { ProjectController } from "../controllers/projectController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getUserProjects);
router.get("/:id", ProjectController.getProject);
router.put("/:id", ProjectController.updateProject);
router.delete("/:id", ProjectController.deleteProject);
router.get("/:id/progress", ProjectController.getProgress);
router.get("/:id/critical-path", ProjectController.getCriticalPath);

export default router;
