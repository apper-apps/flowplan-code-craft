import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { scheduleService } from "@/services/api/scheduleService";
import { taskService } from "@/services/api/taskService";

const WeeklySchedule = ({ refreshTrigger }) => {
  const [schedule, setSchedule] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [scheduleData, tasksData] = await Promise.all([
        scheduleService.getWeeklySchedule(currentWeekStart),
        taskService.getAll()
      ]);
      setSchedule(scheduleData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load schedule data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentWeekStart, refreshTrigger]);

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    try {
      const unscheduledTasks = tasks.filter(task => 
        !task.scheduledDate && task.status !== "completed"
      );
      
      if (unscheduledTasks.length === 0) {
        toast.info("No unscheduled tasks to plan");
        return;
      }

      const newSchedule = await scheduleService.generateWeeklySchedule(
        currentWeekStart,
        unscheduledTasks
      );
      
      setSchedule(newSchedule);
      toast.success(`Generated schedule for ${unscheduledTasks.length} tasks!`);
      
      // Reload tasks to get updated scheduled dates
      const updatedTasks = await taskService.getAll();
      setTasks(updatedTasks);
    } catch (error) {
      toast.error("Failed to generate schedule");
    } finally {
      setIsGenerating(false);
    }
  };

  const getTaskById = (taskId) => {
    return tasks.find(task => task.Id === taskId);
  };

  const getScheduleBlockColor = (importance) => {
    const colors = {
      1: "bg-blue-500",
      2: "bg-green-500",
      3: "bg-yellow-500", 
      4: "bg-orange-500",
      5: "bg-red-500"
    };
    return colors[importance] || colors[3];
  };

  const navigateWeek = (direction) => {
    setCurrentWeekStart(prev => addDays(prev, direction * 7));
  };

  const workDays = Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));
  const timeSlots = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Weekly Schedule
              </h2>
              <p className="text-sm text-text-secondary">
                AI-generated task planning for optimal productivity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => navigateWeek(-1)}>
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm font-medium text-text-primary min-w-[120px] text-center">
              {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
            </span>
            <Button variant="secondary" size="sm" onClick={() => navigateWeek(1)}>
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            {schedule && (
              <div className="text-sm text-text-secondary">
                <span className="font-medium">{schedule.scheduleItems?.length || 0}</span> tasks scheduled
              </div>
            )}
          </div>

          <Button
            onClick={handleGenerateSchedule}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Sparkles" size={16} />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <ApperIcon name="Sparkles" size={16} />
                Generate AI Schedule
              </>
            )}
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-6 gap-2">
          {/* Time column header */}
          <div className="text-center text-sm font-medium text-text-secondary py-2">
            Time
          </div>
          
          {/* Day headers */}
          {workDays.map((day) => (
            <div key={day.toISOString()} className="text-center py-2">
              <div className={`text-sm font-medium ${isToday(day) ? 'text-primary-600' : 'text-text-primary'}`}>
                {format(day, "EEE")}
              </div>
              <div className={`text-xs ${isToday(day) ? 'text-primary-600' : 'text-text-secondary'}`}>
                {format(day, "MMM d")}
              </div>
            </div>
          ))}

          {/* Time slots and schedule items */}
          {timeSlots.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="text-xs text-text-muted text-center py-2 border-t border-gray-100">
                {hour}:00
              </div>
              
              {/* Day slots */}
              {workDays.map((day) => {
                const dayName = format(day, "EEEE").toLowerCase();
                const scheduleItem = schedule?.scheduleItems?.find(item => 
                  item.day === dayName && 
                  parseInt(item.startTime.split(":")[0]) === hour
                );
                
                return (
                  <div key={`${day.toISOString()}-${hour}`} className="border-t border-gray-100 min-h-[40px] p-1">
                    {scheduleItem && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`schedule-block ${getScheduleBlockColor(getTaskById(scheduleItem.taskId)?.importance)} text-xs`}
                      >
                        {getTaskById(scheduleItem.taskId)?.title}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {!schedule?.scheduleItems?.length && (
          <div className="text-center py-12">
            <ApperIcon name="Calendar" size={48} className="text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No Schedule Generated
            </h3>
            <p className="text-text-secondary mb-4">
              Create some tasks and click "Generate AI Schedule" to automatically plan your week.
            </p>
          </div>
        )}
      </Card>

      {/* Schedule Legend */}
      {schedule?.scheduleItems?.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">
            Importance Legend
          </h3>
          <div className="flex gap-4 text-xs">
            {[
              { level: 1, label: "Very Low", color: "bg-blue-500" },
              { level: 2, label: "Low", color: "bg-green-500" },
              { level: 3, label: "Medium", color: "bg-yellow-500" },
              { level: 4, label: "High", color: "bg-orange-500" },
              { level: 5, label: "Critical", color: "bg-red-500" }
            ].map(({ level, label, color }) => (
              <div key={level} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${color}`}></div>
                <span className="text-text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WeeklySchedule;