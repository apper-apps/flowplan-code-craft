import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ImportanceSlider from "@/components/molecules/ImportanceSlider";
import AIEstimationButton from "@/components/molecules/AIEstimationButton";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { aiService } from "@/services/api/aiService";

const TaskForm = ({ onTaskCreated, initialTask = null }) => {
  const [formData, setFormData] = useState({
    title: initialTask?.title || "",
    description: initialTask?.description || "",
    importance: initialTask?.importance || 3,
    estimatedDuration: initialTask?.estimatedDuration || null,
    manualDuration: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAIEstimate = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a task title first");
      return;
    }

    try {
      const estimation = await aiService.estimateTaskDuration({
        title: formData.title,
        description: formData.description,
        importance: formData.importance
      });
      
      setFormData(prev => ({ 
        ...prev, 
        estimatedDuration: estimation.estimatedMinutes 
      }));
      
      toast.success(`AI estimated ${Math.round(estimation.estimatedMinutes / 60)}h ${estimation.estimatedMinutes % 60}m for this task`);
    } catch (error) {
      toast.error("Failed to get AI estimation");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (formData.manualDuration && formData.manualDuration <= 0) {
      newErrors.manualDuration = "Duration must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const finalDuration = formData.manualDuration 
        ? parseInt(formData.manualDuration) * 60 
        : formData.estimatedDuration;

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        importance: formData.importance,
        estimatedDuration: finalDuration,
        status: "not-started"
      };

      let result;
      if (initialTask) {
        result = await taskService.update(initialTask.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        result = await taskService.create(taskData);
        toast.success("Task created successfully!");
      }

      if (onTaskCreated) {
        onTaskCreated(result);
      }

      if (!initialTask) {
        setFormData({
          title: "",
          description: "",
          importance: 3,
          estimatedDuration: null,
          manualDuration: ""
        });
      }
    } catch (error) {
      toast.error(initialTask ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Plus" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {initialTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-sm text-text-secondary">
              {initialTask ? "Update task details" : "Add a new task to your workflow"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Task Title"
            placeholder="Enter task title..."
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
          />

          <FormField
            label="Description (Optional)"
            placeholder="Describe the task details..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          >
            <textarea
              placeholder="Describe the task details..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
          </FormField>

          <ImportanceSlider
            value={formData.importance}
            onChange={(value) => handleInputChange("importance", value)}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-text-primary">Time Estimation</h3>
              <AIEstimationButton
                onEstimate={handleAIEstimate}
                estimatedDuration={formData.estimatedDuration}
                disabled={!formData.title.trim()}
              />
            </div>

            {formData.estimatedDuration && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-primary-50 rounded-lg border border-primary-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Sparkles" size={16} className="text-primary-600" />
                  <span className="text-sm font-medium text-primary-800">
                    AI Estimation: {Math.round(formData.estimatedDuration / 60)}h {formData.estimatedDuration % 60}m
                  </span>
                </div>
                <p className="text-xs text-primary-700">
                  You can override this with a manual estimate below.
                </p>
              </motion.div>
            )}

            <FormField
              label="Manual Duration (Optional)"
              type="number"
              placeholder="Hours..."
              value={formData.manualDuration}
              onChange={(e) => handleInputChange("manualDuration", e.target.value)}
              error={errors.manualDuration}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon name="Loader2" size={16} />
                  </motion.div>
                  {initialTask ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <ApperIcon name={initialTask ? "Save" : "Plus"} size={16} />
                  {initialTask ? "Update Task" : "Create Task"}
                </>
              )}
            </Button>
            
            {initialTask && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onTaskCreated && onTaskCreated(null)}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default TaskForm;