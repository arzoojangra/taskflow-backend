import { UserModel } from "../models/User";
import { userSchema } from "../validation/schema";
import Joi from "joi";
import jwt from "jsonwebtoken";

export const registerUser = async (userData: any) => {
  const { error, value } = userSchema.validate(userData);
  if (error) {
    throw { status: 400, message: error.details[0].message };
  }

  const existingUser = await UserModel.findOne({ email: value.email });
  if (existingUser) {
    throw { status: 400, message: "User already exists" };
  }

  const user = new UserModel(value);
  await user.save();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret"
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async (loginData: any) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error, value } = loginSchema.validate(loginData);
  if (error) {
    throw { status: 400, message: error.details[0].message };
  }

  const user = await UserModel.findOne({ email: value.email });
  if (!user) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const isMatch = await (user as any).comparePassword(value.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret"
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
