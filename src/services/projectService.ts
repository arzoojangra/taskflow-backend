import { ProjectModel } from "../models/Projects";
import { TaskModel } from "../models/Task";
import { TaskDependencyModel } from "../models/TaskDependency";
import { Project, Task, TaskStatus } from "../types";
import DependencyValidator from "../utils/dependencyValidator";
import TaskService from "./taskService";

const ProjectService = {
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const project = new ProjectModel(projectData);
    return await project.save();
  },

  async getProjects(): Promise<Project[]> {
    return await ProjectModel.find().populate("owner_id", "name email");
  },

  async getProjectById(projectId: string): Promise<Project | null> {
    return await ProjectModel.findById(projectId).populate(
      "owner_id",
      "name email"
    );
  },

  async getProjectWithTasks(projectId: string): Promise<any> {
    const project = await ProjectModel.findById(projectId).populate(
      "owner_id",
      "name email"
    );
    if (!project) return null;

    const tasks = await TaskService.getTasksByProjectId(projectId);

    const tasksWithDependencies = await Promise.all(
      tasks.map(async (task: any) => {
        const obj = task.toObject();
        obj.id = obj._id;
        obj.dependencies = await TaskService.getTaskDependencies(obj.id);
        obj.blocking_tasks = await TaskService.getTasksBlockedBy(obj.id);
        return obj;
      })
    );

    return { ...project.toObject(), tasks: tasksWithDependencies };
  },

  async updateProject(
    projectId: string,
    updateData: Partial<Project>
  ): Promise<Project | null> {
    return await ProjectModel.findByIdAndUpdate(projectId, updateData, {
      new: true,
    });
  },

  async deleteProject(projectId: string): Promise<boolean> {
    const session = await ProjectModel.startSession();

    try {
      await session.withTransaction(async () => {
        // Delete all tasks and their dependencies
        const tasks = await TaskModel.find({ project_id: projectId });
        const taskIds = tasks.map((t: Task) => t.id);

        await TaskDependencyModel.deleteMany({
          $or: [
            { task_id: { $in: taskIds } },
            { depends_on_task_id: { $in: taskIds } },
          ],
        });

        await TaskModel.deleteMany({ project_id: projectId });
        await ProjectModel.findByIdAndDelete(projectId);
      });

      return true;
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async calculateProgress(projectId: string): Promise<{
    completion: number;
    totalTasks: number;
    completedTasks: number;
  }> {
    const totalTasks = await TaskModel.countDocuments({
      project_id: projectId,
    });
    const completedTasks = await TaskModel.countDocuments({
      project_id: projectId,
      status: TaskStatus.DONE,
    });

    const completion = parseInt(
      (totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100).toFixed(2)
    );

    return { completion, totalTasks, completedTasks };
  },

  async getCriticalPath(projectId: string): Promise<Task[]> {
    return await DependencyValidator.getCriticalPath(projectId);
  },
};

export default ProjectService;
