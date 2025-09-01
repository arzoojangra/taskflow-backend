import { Request, Response } from "express";
import UserService from "../services/userService";

const UserController = {
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

  async getUsersByType(req: Request, res: Response) {
    try {
      const { type } = req.query;
      const result = await UserService.getUsersByType(type as string);
      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  },
};

export default UserController;
