import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

async create(taskData) {
    await this.delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      actualDuration: null,
      scheduledDate: null,
      scheduledTime: null,
      projectId: taskData.projectId || null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay(350);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  async getTasksByStatus(status) {
    await this.delay(200);
    return this.tasks.filter(task => task.status === status);
  }
async getUnscheduledTasks() {
    await this.delay(200);
    return this.tasks.filter(task => !task.scheduledDate);
  }

  async getTasksByProject(projectId) {
    await this.delay(200);
    return this.tasks.filter(task => task.projectId === parseInt(projectId));
  }

  async updateSchedule(taskId, scheduleData) {
    await this.delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(taskId));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = { 
      ...this.tasks[index], 
      scheduledDate: scheduleData.date,
      scheduledTime: scheduleData.time
    };
    return { ...this.tasks[index] };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const taskService = new TaskService();