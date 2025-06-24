import React from 'react';
import { motion } from 'framer-motion';
import { AIVoiceAgent } from '../AIVoiceAgent';

interface Step {
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  color: string;
  action: string;
}

interface StepContentProps {
  step: Step;
  showAgent: boolean;
}

export const StepContent: React.FC<StepContentProps> = ({ step, showAgent }) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Step Icon and Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${step.color} shadow-2xl mb-4 lg:mb-6`}
        >
          <step.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
        </motion.div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 px-4">
          {step.title}
        </h2>
      </motion.div>

      {/* AI Voice Agent */}
      {showAgent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4"
        >
          <AIVoiceAgent
            message={step.content}
            isActive={true}
            agentName="Your Personal DeedAI Assistant"
            showVisualizer={true}
          />
        </motion.div>
      )}
    </div>
  );
};