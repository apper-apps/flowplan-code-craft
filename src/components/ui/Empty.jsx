import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getEmptyState = () => {
    if (location.pathname === "/schedule") {
      return {
        icon: "Calendar",
        title: "No Schedule Generated",
        description: "Create some tasks first, then use AI to generate your optimal weekly schedule.",
        actionText: "Go to Tasks",
        action: () => navigate("/")
      };
    }

    if (location.pathname === "/analytics") {
      return {
        icon: "BarChart3",
        title: "No Data Available",
        description: "Complete some tasks to see your productivity analytics and insights.",
        actionText: "View Tasks",
        action: () => navigate("/")
      };
    }

    // Default empty state for tasks
    return {
      icon: "CheckSquare",
      title: "No Tasks Yet",
      description: "Start organizing your work by creating your first task. The AI will help estimate time and plan your schedule.",
      actionText: "Create First Task",
      action: null
    };
  };

  const emptyState = getEmptyState();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[500px]"
    >
      <Card className="p-12 text-center max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={emptyState.icon} size={40} className="text-primary-600" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-text-primary mb-3">
          {emptyState.title}
        </h3>
        
        <p className="text-text-secondary mb-8 leading-relaxed">
          {emptyState.description}
        </p>
        
        {emptyState.action && (
          <Button onClick={emptyState.action} size="lg" className="gap-2">
            <ApperIcon name="Plus" size={18} />
            {emptyState.actionText}
          </Button>
        )}

        {location.pathname === "/" && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-text-primary mb-3">
              AI Features Available:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <ApperIcon name="Sparkles" size={14} className="text-primary-600" />
                Smart time estimation
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <ApperIcon name="Calendar" size={14} className="text-primary-600" />
                Automatic scheduling
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <ApperIcon name="Target" size={14} className="text-primary-600" />
                Priority optimization
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <ApperIcon name="BarChart3" size={14} className="text-primary-600" />
                Progress analytics
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Empty;