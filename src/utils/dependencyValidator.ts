import { TaskModel } from "../models/Task";
import { TaskDependencyModel } from "../models/TaskDependency";
import { TaskStatus } from "../types";

const DependencyValidator = {
  /**
   * Check if adding a dependency would create a circular dependency
   */
  async wouldCreateCircularDependency(
    taskId: string,
    dependsOnTaskId: string
  ): Promise<boolean> {
    // If a task depends on itself, it's circular
    if (taskId === dependsOnTaskId) {
      return true;
    }

    const visited = new Set<string>();

    const hasPathTo = async (
      fromTask: string,
      toTask: string
    ): Promise<boolean> => {
      if (fromTask === toTask) return true;
      if (visited.has(fromTask)) return false;

      visited.add(fromTask);

      const dependencies = await TaskDependencyModel.find({
        task_id: fromTask,
      });

      for (const dep of dependencies) {
        if (await hasPathTo(dep.depends_on_task_id.toString(), toTask)) {
          return true;
        }
      }

      return false;
    };

    return await hasPathTo(dependsOnTaskId, taskId);
  },

  /**
   * Get all tasks that are blocking a specific task
   */
  async getBlockingTasks(taskId: string): Promise<string[]> {
    const dependencies = await TaskDependencyModel.find({
      task_id: taskId,
    }).populate("depends_on_task_id");

    const blockingTasks: string[] = [];

    for (const dep of dependencies) {
      const task = await TaskModel.findById(dep.depends_on_task_id);
      if (task && task.status !== TaskStatus.DONE) {
        blockingTasks.push(dep.depends_on_task_id.toString());
      }
    }

    return blockingTasks;
  },

  /**
   * Check if a task can change to a specific status
   */
  async canChangeStatus(
    taskId: string,
    newStatus: TaskStatus
  ): Promise<{ canChange: boolean; reason?: string }> {
    if (newStatus !== TaskStatus.DONE) {
      return { canChange: true };
    }

    const blockingTasks = await this.getBlockingTasks(taskId);

    if (blockingTasks.length > 0) {
      return {
        canChange: false,
        reason: `Task has ${blockingTasks.length} incomplete dependencies`,
      };
    }

    return { canChange: true };
  },

  /**
   * Get critical path for a project (longest dependency chain)
   */
  async getCriticalPath(projectId: string): Promise<any> {
    const tasks = await TaskModel.find({ project_id: projectId }).lean();
    const taskMap: { [key: string]: any } = {};
    const taskIds = tasks.map((t) => {
      taskMap[t._id.toString()] = t;
      return t._id.toString();
    });

    const dependencies = await TaskDependencyModel.find({
      task_id: { $in: taskIds },
      depends_on_task_id: { $in: taskIds },
    }).lean();

    // Build adjacency list
    const graph: { [key: string]: string[] } = {};
    const inDegree: { [key: string]: number } = {};

    for (const taskId of taskIds) {
      graph[taskId] = [];
      inDegree[taskId] = 0;
    }

    for (const dep of dependencies) {
      graph[dep.depends_on_task_id.toString()].push(dep.task_id.toString());
      inDegree[dep.task_id.toString()]++;
    }

    // Track longest path
    const distances: { [key: string]: number } = {};
    const paths: { [key: string]: string[] } = {};

    for (const taskId of taskIds) {
      distances[taskId] = 0;
      paths[taskId] = [taskId];
    }

    const queue: string[] = [];
    for (const taskId of taskIds) {
      if (inDegree[taskId] === 0) queue.push(taskId);
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const neighbor of graph[current]) {
        if (distances[current] + 1 > distances[neighbor]) {
          distances[neighbor] = distances[current] + 1;
          paths[neighbor] = [...paths[current], neighbor];
        }

        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) queue.push(neighbor);
      }
    }

    // Find the critical path
    let maxDistance = 0;
    let criticalPathIds: string[] = [];

    for (const taskId of taskIds) {
      if (distances[taskId] > maxDistance) {
        maxDistance = distances[taskId];
        criticalPathIds = paths[taskId];
      }
    }

    // Build response
    const tasksInPath = criticalPathIds.map((id) => ({
      id,
      name: taskMap[id].title,
      start_date: taskMap[id].start_date,
      end_date: taskMap[id].end_date,
      duration: taskMap[id].duration,
      isCritical: true,
    }));

    const edges = [];
    for (let i = 0; i < criticalPathIds.length - 1; i++) {
      edges.push({
        from: criticalPathIds[i],
        to: criticalPathIds[i + 1],
      });
    }

    return {
      projectId,
      criticalPath: {
        taskIds: criticalPathIds,
        tasks: tasksInPath,
        edges,
      },
    };
  },
};

export default DependencyValidator;
