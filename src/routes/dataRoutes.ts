import { Router } from "express";
import DataController from "../controllers/dataController";

const router = Router();

router.get("/task", DataController.taskFields);
router.get("/project", DataController.projectFields);

export default router;
