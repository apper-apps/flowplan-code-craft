import schedulesData from "@/services/mockData/schedules.json";
import { format, startOfWeek } from "date-fns";

class ScheduleService {
  constructor() {
    this.schedules = [...schedulesData];
  }

  async getWeeklySchedule(weekStartDate) {
    await this.delay(300);
    const weekKey = format(weekStartDate, "yyyy-MM-dd");
    const schedule = this.schedules.find(s => s.weekStartDate === weekKey);
    return schedule ? { ...schedule } : null;
  }

async generateWeeklySchedule(weekStartDate, tasks, workingHours = null) {
    await this.delay(800); // Simulate AI processing time
    
    const weekKey = format(weekStartDate, "yyyy-MM-dd");
    
    // Sort tasks by importance (highest first) and estimated duration
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance; // Higher importance first
      }
      return (a.estimatedDuration || 0) - (b.estimatedDuration || 0); // Shorter duration first for same importance
    });

    // Default working hours if not provided
    const defaultWorkingHours = {
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "09:00", end: "17:00", enabled: false },
      sunday: { start: "09:00", end: "17:00", enabled: false }
    };

    const hours = workingHours || defaultWorkingHours;
    const workDays = Object.keys(hours).filter(day => hours[day].enabled);
    
const scheduleItems = [];
    let currentDay = 0;
    let currentDayHours = 0;
    let scheduleItemId = Math.max(...this.schedules.flatMap(s => s.scheduleItems.map(item => item.Id)), 0) + 1;

    for (const task of sortedTasks) {
      const taskHours = (task.estimatedDuration || 60) / 60; // Convert minutes to hours
      
      // Get current day's working hours
      if (currentDay >= workDays.length) break;
      
      const currentDayName = workDays[currentDay];
      const dayHours = hours[currentDayName];
      const startHour = parseInt(dayHours.start.split(':')[0]);
      const endHour = parseInt(dayHours.end.split(':')[0]);
      const maxHoursPerDay = endHour - startHour;
      
      // If task won't fit in current day, move to next day
      if (currentDayHours + taskHours > maxHoursPerDay) {
        currentDay++;
        currentDayHours = 0;
        if (currentDay >= workDays.length) break;
      }
      
      const currentDayInfo = hours[workDays[currentDay]];
      const dayStartHour = parseInt(currentDayInfo.start.split(':')[0]);
      const actualStartHour = dayStartHour + Math.floor(currentDayHours);
      const startMinute = Math.round((currentDayHours % 1) * 60);
      const endTime = currentDayHours + taskHours;
      const endHour = dayStartHour + Math.floor(endTime);
      const endMinute = Math.round((endTime % 1) * 60);
      
      scheduleItems.push({
        Id: scheduleItemId++,
        taskId: task.Id.toString(),
        day: workDays[currentDay],
        startTime: `${actualStartHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`,
        endTime: `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`
      });
      
      currentDayHours += taskHours + 0.25; // Add 15-minute buffer between tasks
    }

    const newSchedule = {
      Id: Math.max(...this.schedules.map(s => s.Id), 0) + 1,
      weekStartDate: weekKey,
      scheduleItems,
      generatedAt: new Date().toISOString(),
      totalHours: scheduleItems.reduce((total, item) => {
        const start = item.startTime.split(":").map(Number);
        const end = item.endTime.split(":").map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];
        return total + (endMinutes - startMinutes) / 60;
      }, 0)
    };

    // Remove existing schedule for this week if it exists
    this.schedules = this.schedules.filter(s => s.weekStartDate !== weekKey);
    this.schedules.push(newSchedule);

    return { ...newSchedule };
  }

  async getAllSchedules() {
    await this.delay(200);
    return [...this.schedules];
  }

  async deleteSchedule(weekStartDate) {
    await this.delay(250);
    const weekKey = format(weekStartDate, "yyyy-MM-dd");
    const index = this.schedules.findIndex(s => s.weekStartDate === weekKey);
    
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    
    this.schedules.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const scheduleService = new ScheduleService();