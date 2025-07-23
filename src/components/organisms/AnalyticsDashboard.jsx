import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { taskService } from "@/services/api/taskService";
import { scheduleService } from "@/services/api/scheduleService";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    try {
      setError(null);
      setLoading(true);
      const [tasks, schedules] = await Promise.all([
        taskService.getAll(),
        scheduleService.getAllSchedules()
      ]);

      // Calculate analytics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === "completed").length;
      const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
      const notStartedTasks = tasks.filter(t => t.status === "not-started").length;
      
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      const totalEstimatedHours = tasks.reduce((sum, task) => 
        sum + (task.estimatedDuration || 0), 0) / 60;
      
      const totalActualHours = tasks
        .filter(t => t.actualDuration)
        .reduce((sum, task) => sum + task.actualDuration, 0) / 60;

      const importanceDistribution = {
        1: tasks.filter(t => t.importance === 1).length,
        2: tasks.filter(t => t.importance === 2).length,
        3: tasks.filter(t => t.importance === 3).length,
        4: tasks.filter(t => t.importance === 4).length,
        5: tasks.filter(t => t.importance === 5).length,
      };

      setAnalytics({
        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        completionRate,
        totalEstimatedHours,
        totalActualHours,
        importanceDistribution,
        totalSchedules: schedules.length
      });
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  const StatCard = ({ title, value, subtitle, icon, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-card-hover transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {subtitle && (
              <p className="text-sm text-text-muted mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
            <ApperIcon name={icon} size={24} className={`text-${color}-600`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const ProgressBar = ({ percentage, color = "primary" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`h-2 bg-${color}-500 rounded-full`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ApperIcon name="BarChart3" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary">Track your productivity and planning accuracy</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          icon="CheckSquare"
          color="primary"
        />
        <StatCard
          title="Completed"
          value={analytics.completedTasks}
          subtitle={`${analytics.completionRate.toFixed(1)}% completion rate`}
          icon="CheckCircle2"
          color="green"
        />
        <StatCard
          title="In Progress"
          value={analytics.inProgressTasks}
          icon="Clock"
          color="yellow"
        />
        <StatCard
          title="Not Started"
          value={analytics.notStartedTasks}
          icon="Circle"
          color="gray"
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Task Completion Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Completed</span>
                <span className="text-text-primary font-medium">
                  {analytics.completedTasks}/{analytics.totalTasks}
                </span>
              </div>
              <ProgressBar percentage={analytics.completionRate} color="green" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">In Progress</span>
                <span className="text-text-primary font-medium">
                  {analytics.inProgressTasks}/{analytics.totalTasks}
                </span>
              </div>
              <ProgressBar 
                percentage={(analytics.inProgressTasks / analytics.totalTasks) * 100} 
                color="yellow" 
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Time Tracking
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Estimated Hours</span>
              <span className="text-lg font-semibold text-text-primary">
                {analytics.totalEstimatedHours.toFixed(1)}h
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Actual Hours</span>
              <span className="text-lg font-semibold text-text-primary">
                {analytics.totalActualHours.toFixed(1)}h
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">AI Schedules Created</span>
              <span className="text-lg font-semibold text-text-primary">
                {analytics.totalSchedules}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Importance Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Task Importance Distribution
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(analytics.importanceDistribution).map(([level, count]) => {
            const colors = {
              1: "blue",
              2: "green", 
              3: "yellow",
              4: "orange",
              5: "red"
            };
            const labels = {
              1: "Very Low",
              2: "Low",
              3: "Medium",
              4: "High", 
              5: "Critical"
            };
            
            return (
              <div key={level} className="text-center">
                <div className={`w-full h-24 bg-${colors[level]}-100 rounded-lg flex items-center justify-center mb-2`}>
                  <span className={`text-2xl font-bold text-${colors[level]}-600`}>
                    {count}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{labels[level]}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;