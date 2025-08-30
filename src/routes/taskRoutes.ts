import { Router } from "express";
import { TaskController } from "../controllers/taskController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

// Task management routes
router.post("/projects/:id/tasks", TaskController.createTask);
router.get("/tasks/:id", TaskController.getTask);
router.put("/tasks/:id", TaskController.updateTask);
router.put("/tasks/:id/status", TaskController.updateTaskStatus);
router.delete("/tasks/:id", TaskController.deleteTask);

// Dependency management routes
router.post("/tasks/:id/dependencies", TaskController.addDependency);
router.delete(
  "/tasks/:taskId/dependencies/:depId",
  TaskController.removeDependency
);
router.get("/tasks/:id/dependencies", TaskController.getTaskDependencies);
router.get("/tasks/:id/blocking", TaskController.getTasksBlocking);

export default router;
