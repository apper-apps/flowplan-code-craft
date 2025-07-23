import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from "date-fns";

export const formatDate = (date) => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return "Today";
  } else if (isYesterday(dateObj)) {
    return "Yesterday";
  } else if (isTomorrow(dateObj)) {
    return "Tomorrow";
  } else {
    return format(dateObj, "MMM d, yyyy");
  }
};

export const formatTime = (date) => {
  return format(new Date(date), "h:mm a");
};

export const formatDuration = (minutes) => {
  if (!minutes) return "Not set";
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatImportanceLevel = (level) => {
  const levels = {
    1: "Very Low",
    2: "Low",
    3: "Medium",
    4: "High",
    5: "Critical"
  };
  return levels[level] || "Medium";
};

export const formatCompletionRate = (completed, total) => {
  if (total === 0) return "0%";
  return `${Math.round((completed / total) * 100)}%`;
};