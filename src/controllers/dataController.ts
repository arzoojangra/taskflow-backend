import { Request, Response } from "express";
import DataService from "../services/dataService";

const DataController = {
  async taskFields(req: Request, res: Response) {
    try {
      const result = await DataService.taskFields();
      res.status(201).json(result);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Internal server error" });
    }
  },

  async projectFields(req: Request, res: Response) {
    try {
      const result = await DataService.projectFields();
      res.status(201).json(result);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Internal server error" });
    }
  },
};

export default DataController;
