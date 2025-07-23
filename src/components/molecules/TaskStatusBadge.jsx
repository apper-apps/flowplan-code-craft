import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TaskStatusBadge = ({ status }) => {
  const statusConfig = {
    "not-started": {
      variant: "default",
      icon: "Circle",
      label: "Not Started"
    },
    "in-progress": {
      variant: "warning", 
      icon: "Clock",
      label: "In Progress"
    },
    "completed": {
      variant: "success",
      icon: "CheckCircle2",
      label: "Completed"
    }
  };

  const config = statusConfig[status] || statusConfig["not-started"];

  return (
    <Badge variant={config.variant} className="gap-1">
      <ApperIcon name={config.icon} size={12} />
      {config.label}
    </Badge>
  );
};

export default TaskStatusBadge;