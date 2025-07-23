import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const SettingsPage = () => {
const [settings, setSettings] = useState({
    workingHours: {
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "09:00", end: "17:00", enabled: false },
      sunday: { start: "09:00", end: "17:00", enabled: false }
    },
    aiEstimationEnabled: true,
    autoSchedulingEnabled: true,
    breakDuration: 15,
    maxTasksPerDay: 8
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

const handleWorkDayToggle = (day) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          enabled: !prev.workingHours[day].enabled
        }
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

const workDayOptions = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
          <ApperIcon name="Settings" size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary">Configure your workspace and AI preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Working Hours by Day
          </h3>
          <div className="space-y-4">
            {workDayOptions.map(({ key, label }) => (
              <div key={key} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.workingHours[key].enabled}
                      onChange={() => handleWorkDayToggle(key)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-text-primary">{label}</span>
                  </label>
                </div>
                
                {settings.workingHours[key].enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={settings.workingHours[key].start}
                        onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-secondary mb-1 block">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={settings.workingHours[key].end}
                        onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* AI Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            AI Configuration
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiEstimationEnabled}
                onChange={(e) => handleInputChange("aiEstimationEnabled", e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">
                  AI Time Estimation
                </span>
                <p className="text-xs text-text-secondary">
                  Automatically estimate task duration using AI
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSchedulingEnabled}
                onChange={(e) => handleInputChange("autoSchedulingEnabled", e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">
                  Auto Scheduling
                </span>
                <p className="text-xs text-text-secondary">
                  Generate weekly schedules automatically
                </p>
              </div>
            </label>

            <FormField
              label="Break Duration (minutes)"
              type="number"
              min="5"
              max="60"
              value={settings.breakDuration}
              onChange={(e) => handleInputChange("breakDuration", e.target.value)}
            />

            <FormField
              label="Max Tasks Per Day"
              type="number"
              min="1"
              max="20"
              value={settings.maxTasksPerDay}
              onChange={(e) => handleInputChange("maxTasksPerDay", e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="gap-2"
        >
          {isSaving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ApperIcon name="Loader2" size={18} />
              </motion.div>
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={18} />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* AI Info Section */}
      <Card className="p-6 bg-gradient-surface border-primary-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Sparkles" size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-2">
              AI Optimization Tips
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <ApperIcon name="CheckCircle2" size={14} className="text-green-600" />
                Keep task descriptions detailed for better AI estimation
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="CheckCircle2" size={14} className="text-green-600" />
                Set realistic work hours for optimal scheduling
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="CheckCircle2" size={14} className="text-green-600" />
                Include break time for better work-life balance
              </li>
              <li className="flex items-center gap-2">
                <ApperIcon name="CheckCircle2" size={14} className="text-green-600" />
                Review and adjust AI suggestions based on your experience
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;