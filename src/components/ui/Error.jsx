import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="p-8 text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-text-secondary mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <ApperIcon name="RefreshCw" size={16} />
            Try Again
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default Error;