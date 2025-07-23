class AIService {
  async estimateTaskDuration(taskData) {
    await this.delay(1000); // Simulate AI processing time
    
    const { title, description, importance } = taskData;
    
    // Base estimation logic based on task characteristics
    let baseMinutes = 60; // Default 1 hour
    
    // Adjust based on title keywords
    const titleLower = title.toLowerCase();
    if (titleLower.includes("meeting") || titleLower.includes("call")) {
      baseMinutes = 60;
    } else if (titleLower.includes("review") || titleLower.includes("analysis")) {
      baseMinutes = 90;
    } else if (titleLower.includes("design") || titleLower.includes("create")) {
      baseMinutes = 180;
    } else if (titleLower.includes("develop") || titleLower.includes("implement")) {
      baseMinutes = 240;
    } else if (titleLower.includes("research") || titleLower.includes("planning")) {
      baseMinutes = 120;
    }
    
    // Adjust based on description length
    if (description) {
      const descriptionWords = description.split(" ").length;
      if (descriptionWords > 50) {
        baseMinutes *= 1.5;
      } else if (descriptionWords > 20) {
        baseMinutes *= 1.2;
      }
    }
    
    // Adjust based on importance (higher importance = more thorough work = more time)
    const importanceMultiplier = {
      1: 0.8,
      2: 0.9,
      3: 1.0,
      4: 1.2,
      5: 1.4
    };
    
    baseMinutes *= importanceMultiplier[importance] || 1.0;
    
    // Add some randomness to make it feel more realistic
    const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
    const finalMinutes = Math.round(baseMinutes * randomFactor);
    
    // Round to nearest 15 minutes for practical scheduling
    const roundedMinutes = Math.round(finalMinutes / 15) * 15;
    
    return {
      estimatedMinutes: Math.max(15, roundedMinutes), // Minimum 15 minutes
      confidence: Math.random() * 0.3 + 0.7, // Between 70-100% confidence
      factors: {
        titleAnalysis: titleLower.includes("meeting") ? "meeting" : "complex_task",
        descriptionComplexity: description ? (description.split(" ").length > 20 ? "detailed" : "simple") : "minimal",
        importanceImpact: importance >= 4 ? "high_stakes" : "standard"
      }
    };
  }

  async optimizeSchedule(tasks, constraints = {}) {
    await this.delay(1200);
    
    const {
      workHoursStart = 9,
      workHoursEnd = 17,
      breakDuration = 15,
      maxTasksPerDay = 8
    } = constraints;
    
    // This would contain more sophisticated scheduling logic
    // For now, return a simple optimization suggestion
    return {
      optimizationScore: Math.random() * 30 + 70, // 70-100% optimization score
      suggestions: [
        "Consider grouping similar tasks together for better focus",
        "Schedule high-importance tasks during peak productivity hours",
        "Add buffer time between meetings for preparation"
      ],
      estimatedProductivity: Math.random() * 20 + 80 // 80-100% estimated productivity
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiService = new AIService();