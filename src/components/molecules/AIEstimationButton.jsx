import { useState } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const AIEstimationButton = ({ onEstimate, estimatedDuration, disabled }) => {
  const [isEstimating, setIsEstimating] = useState(false);

  const handleEstimate = async () => {
    setIsEstimating(true);
    await onEstimate();
    setIsEstimating(false);
  };

  if (estimatedDuration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2"
      >
        <Badge variant="ai" className="gap-1.5">
          <ApperIcon name="Sparkles" size={14} />
          AI Estimated: {Math.round(estimatedDuration / 60)}h {estimatedDuration % 60}m
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEstimate}
          disabled={disabled || isEstimating}
        >
          <ApperIcon name="RefreshCw" size={14} />
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      variant="ai"
      size="sm"
      onClick={handleEstimate}
      disabled={disabled || isEstimating}
      className="gap-2"
    >
      {isEstimating ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon name="Sparkles" size={16} />
          </motion.div>
          Estimating...
        </>
      ) : (
        <>
          <ApperIcon name="Sparkles" size={16} />
          Get AI Estimate
        </>
      )}
    </Button>
  );
};

export default AIEstimationButton;