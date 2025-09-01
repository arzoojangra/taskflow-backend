import { ProjectStatus, TaskPriority, TaskStatus, UserRole } from "../types";
import ProjectService from "./projectService";
import TaskService from "./taskService";
import UserService from "./userService";

const DataService = {
  async taskFields() {
    const fields = {
      taskPriority: Object.values(TaskPriority),
      taskStatus: Object.values(TaskStatus),
      projects: await ProjectService.getProjects(),
      tasks: await TaskService.getAllTasks(),
      users: await UserService.getUsersByType(UserRole.DEVELOPER),
    };
    return fields;
  },

  async projectFields() {
    const fields = {
      projectStatus: Object.values(ProjectStatus),
      users: await UserService.getUsersByType(UserRole.MANAGER),
    };
    return fields;
  },
};

export default DataService;
