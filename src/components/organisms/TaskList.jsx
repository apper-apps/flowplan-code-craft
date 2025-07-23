import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import TaskStatusBadge from "@/components/molecules/TaskStatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";

const TaskList = ({ onEditTask, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success("Task status updated!");
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getImportanceBadgeClass = (importance) => {
    const classes = {
      1: "importance-1",
      2: "importance-2", 
      3: "importance-3",
      4: "importance-4",
      5: "importance-5"
    };
    return classes[importance] || classes[3];
  };

  const getImportanceLabel = (importance) => {
    const labels = {
      1: "Very Low",
      2: "Low",
      3: "Medium", 
      4: "High",
      5: "Critical"
    };
    return labels[importance] || "Medium";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTasks} />;
  if (!tasks.length) return <Empty />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Task List ({tasks.length})
        </h2>
        <Button variant="ghost" size="sm" onClick={loadTasks}>
          <ApperIcon name="RefreshCw" size={16} />
          Refresh
        </Button>
      </div>

      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {task.title}
                    </h3>
                    <Badge className={`importance-badge ${getImportanceBadgeClass(task.importance)}`}>
                      {getImportanceLabel(task.importance)}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-text-secondary mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    {task.estimatedDuration && (
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={14} />
                        <span>
                          {Math.round(task.estimatedDuration / 60)}h {task.estimatedDuration % 60}m
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      <span>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TaskStatusBadge status={task.status} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTask(task)}
                  >
                    <ApperIcon name="Edit2" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.Id)}
                    className="text-accent-coral hover:text-accent-coral hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <span className="text-sm text-text-secondary">Status:</span>
                <div className="flex gap-2">
                  {["not-started", "in-progress", "completed"].map((status) => (
                    <Button
                      key={status}
                      variant={task.status === status ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => handleStatusChange(task.Id, status)}
                      className="text-xs"
                    >
                      {status === "not-started" && "Not Started"}
                      {status === "in-progress" && "In Progress"}
                      {status === "completed" && "Completed"}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;