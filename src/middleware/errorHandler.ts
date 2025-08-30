import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "Validation Error", details: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: "Duplicate entry" });
  }

  res.status(500).json({ error: "Internal server error" });
};
