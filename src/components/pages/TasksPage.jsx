import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/organisms/TaskForm";
import TaskList from "@/components/organisms/TaskList";

const TasksPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTask, setEditingTask] = useState(null);

  const handleTaskCreated = (task) => {
    if (task) {
      setRefreshTrigger(prev => prev + 1);
    }
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ApperIcon name="CheckSquare" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Task Management</h1>
          <p className="text-text-secondary">Create and organize your tasks with AI assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <TaskForm 
            onTaskCreated={handleTaskCreated}
            initialTask={editingTask}
          />
        </div>
        
        <div>
          <TaskList 
            onEditTask={handleEditTask}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TasksPage;