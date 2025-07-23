import { motion } from "framer-motion";
import AnalyticsDashboard from "@/components/organisms/AnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnalyticsDashboard />
    </motion.div>
  );
};

export default AnalyticsPage;