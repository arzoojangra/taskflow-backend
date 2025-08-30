import { ProjectModel } from "../models/Projects";
import { TaskModel } from "../models/Task";
import { TaskDependencyModel } from "../models/TaskDependency";
import { Project, Task, TaskStatus } from "../types";
import DependencyValidator from "../utils/dependencyValidator";

const ProjectService = {
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const project = new ProjectModel(projectData);
    return await project.save();
  },

  async getUserProjects(userId: string): Promise<Project[]> {
    return await ProjectModel.find({ owner_id: userId });
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

    const tasks = await TaskModel.find({ project_id: projectId }).populate(
      "assignee_id",
      "name email"
    );

    return { ...project.toObject(), tasks };
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
        const taskIds = tasks.map((t: Task) => t._id);

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

    const completion =
      totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    return { completion, totalTasks, completedTasks };
  },

  async getCriticalPath(projectId: string): Promise<string[]> {
    return await DependencyValidator.getCriticalPath(projectId);
  },
};

export default ProjectService;
