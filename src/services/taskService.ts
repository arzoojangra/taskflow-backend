import { TaskModel } from "../models/Task";
import { TaskDependencyModel } from "../models/TaskDependency";
import { Task, TaskStatus } from "../types";
import DependencyValidator from "../utils/dependencyValidator";

const TaskService = {
  async createTask(taskData: Partial<Task>): Promise<Task> {
    const task = new TaskModel(taskData);
    return await task.save();
  },

  async getTaskById(taskId: string): Promise<Task | null> {
    return await TaskModel.findById(taskId)
      .populate("assignee_id", "name email")
      .populate("project_id", "name");
  },

  async updateTask(
    taskId: string,
    updateData: Partial<Task>
  ): Promise<Task | null> {
    return await TaskModel.findByIdAndUpdate(taskId, updateData, { new: true });
  },

  async updateTaskStatus(
    taskId: string,
    status: TaskStatus
  ): Promise<{ success: boolean; message?: string; task?: Task | null }> {
    const validation = await DependencyValidator.canChangeStatus(
      taskId,
      status
    );

    if (!validation.canChange) {
      return { success: false, message: validation.reason };
    }

    const task = await TaskModel.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    return { success: true, task };
  },

  async deleteTask(taskId: string): Promise<boolean> {
    const session = await TaskModel.startSession();

    try {
      await session.withTransaction(async () => {
        // Delete all dependencies related to this task
        await TaskDependencyModel.deleteMany({
          $or: [{ task_id: taskId }, { depends_on_task_id: taskId }],
        });

        await TaskModel.findByIdAndDelete(taskId);
      });

      return true;
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async addDependency(
    taskId: string,
    dependsOnTaskId: string
  ): Promise<{ success: boolean; message?: string; dependency?: any }> {
    // Check if both tasks exist and are in the same project
    const [task, dependsOnTask] = await Promise.all([
      TaskModel.findById(taskId),
      TaskModel.findById(dependsOnTaskId),
    ]);

    if (!task || !dependsOnTask) {
      return { success: false, message: "One or both tasks not found" };
    }

    if (task.project_id.toString() !== dependsOnTask.project_id.toString()) {
      return { success: false, message: "Tasks must be in the same project" };
    }

    // Check for circular dependency
    const wouldCreateCircular =
      await DependencyValidator.wouldCreateCircularDependency(
        taskId,
        dependsOnTaskId
      );

    if (wouldCreateCircular) {
      return {
        success: false,
        message: "This dependency would create a circular dependency",
      };
    }

    // Check if dependency already exists
    const existingDep = await TaskDependencyModel.findOne({
      task_id: taskId,
      depends_on_task_id: dependsOnTaskId,
    });
    if (existingDep) {
      return { success: false, message: "Dependency already exists" };
    }

    const dependency = new TaskDependencyModel({
      task_id: taskId,
      depends_on_task_id: dependsOnTaskId,
    });
    await dependency.save();

    return { success: true, dependency };
  },

  async removeDependency(
    taskId: string,
    dependencyId: string
  ): Promise<boolean> {
    const result = await TaskDependencyModel.findOneAndDelete({
      _id: dependencyId,
      task_id: taskId,
    });

    return !!result;
  },

  async getTaskDependencies(taskId: string): Promise<any[]> {
    return await TaskDependencyModel.find({ task_id: taskId }).populate(
      "depends_on_task_id",
      "title status priority"
    );
  },

  async getTasksBlockedBy(taskId: string): Promise<any[]> {
    return await TaskDependencyModel.find({
      depends_on_task_id: taskId,
    }).populate("task_id", "title status priority estimated_hours");
  },

  async getAllTasks(): Promise<Task[]> {
    const tasks = await TaskModel.find();
    if (!tasks.length) return [];
    return tasks;
  },

  async getTasksByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ project_id: projectId })
      .populate("assignee_id", "name email")
      .populate("project_id", "title");
    if (!tasks.length) return [];
    return tasks;
  },
};

export default TaskService;
