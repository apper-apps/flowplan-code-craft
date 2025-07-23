import { useState } from "react";
import { motion } from "framer-motion";
import WeeklySchedule from "@/components/organisms/WeeklySchedule";

const SchedulePage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <WeeklySchedule refreshTrigger={refreshTrigger} />
    </motion.div>
  );
};

export default SchedulePage;