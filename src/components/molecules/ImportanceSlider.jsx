import { useState } from "react";
import Label from "@/components/atoms/Label";
import Slider from "@/components/atoms/Slider";
import Badge from "@/components/atoms/Badge";

const ImportanceSlider = ({ value, onChange, className }) => {
  const getImportanceLabel = (level) => {
    const labels = {
      1: "Very Low",
      2: "Low", 
      3: "Medium",
      4: "High",
      5: "Critical"
    };
    return labels[level];
  };

  const getImportanceColor = (level) => {
    const colors = {
      1: "bg-blue-100 text-blue-800",
      2: "bg-green-100 text-green-800",
      3: "bg-yellow-100 text-yellow-800", 
      4: "bg-orange-100 text-orange-800",
      5: "bg-red-100 text-red-800"
    };
    return colors[level];
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <Label>Importance Level</Label>
        <Badge className={getImportanceColor(value)}>
          {getImportanceLabel(value)}
        </Badge>
      </div>
      <Slider
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="mb-2"
      />
      <div className="flex justify-between text-xs text-text-muted">
        <span>Very Low</span>
        <span>Critical</span>
      </div>
    </div>
  );
};

export default ImportanceSlider;