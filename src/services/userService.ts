import { UserModel } from "../models/User";
import { userSchema } from "../validation/schema";

const UserService = {
  async registerUser(userData: any) {
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

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async getUsersByType(type: string) {
    let usersList = [];
    if (!type) {
      let users = await UserModel.find().select("-__v -createdAt -updatedAt");
      usersList = users.map((user) => {
        user.id = user._id;
        return user;
      });
    } else {
      if (!["manager", "developer"].includes(type)) {
        throw { status: 400, message: "Invalid user type" };
      }
      let users = await UserModel.find({ role: type }).select(
        "-__v -createdAt -updatedAt"
      );
      usersList = users.map((user) => {
        user.id = user._id;
        return user;
      });
    }
    return usersList;
  },
};

export default UserService;