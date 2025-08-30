import { Request, Response } from "express";
import * as UserService from "../services/userService";

export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const result = await UserService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Internal server error" });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await UserService.loginUser(req.body);
      res.json(result);
    } catch (error: any) {
      res
        .status(error.status || 500)
        .json({ error: error.message || "Internal server error" });
    }
  },
};
