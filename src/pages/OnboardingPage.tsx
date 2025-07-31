import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AIVoiceAgent } from '../components/AIVoiceAgent';
import { 
  Building2, 
  ArrowRight,
  CheckCircle,
  User,
  Shield,
  Zap,
  Heart,
  Sparkles
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showAgent, setShowAgent] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    {
      title: `Welcome to your real estate future, ${user?.name?.split(' ')[0]}! 🏡`,
      content: `Hi there! I'm your personal DeedAI assistant, and I'm absolutely thrilled to meet you. Think of me as your friendly guide who's here to make property ownership as smooth as silk. I've helped thousands of people secure their real estate dreams, and I can't wait to help you too. Let's embark on this exciting journey together!`,
      icon: User,
      color: 'from-emerald-400 to-blue-500',
      action: 'Let\'s begin this adventure!'
    },
    {
      title: "Your security is my top priority 🛡️",
      content: `I want you to feel completely confident about your data security. Every piece of information you share with me is encrypted with military-grade protection and stored on the Algorand blockchain - that's like having a digital vault that's virtually impossible to break into. Your property records will be immutable, secure, and accessible only to you. I promise to keep your information safer than a treasure in a dragon's lair!`,
      icon: Shield,
      color: 'from-purple-400 to-emerald-500',
      action: 'I trust you completely!'
    },
    {
      title: "I'm powered by cutting-edge AI magic ✨",
      content: `Here's what makes me special - I can understand complex legal documents, explain them in simple terms, and even create personalized video explanations just for you! I'll be your translator for all that confusing legal jargon, your guide through document uploads, and your cheerleader throughout the entire process. Think of me as having a brilliant lawyer, a patient teacher, and a supportive friend all rolled into one!`,
      icon: Zap,
      color: 'from-blue-400 to-purple-500',
      action: 'Show me what you can do!'
    },
    {
      title: "Ready to revolutionize your real estate experience? 🚀",
      content: `You're all set for an amazing journey! I'm here 24/7 whenever you need help, have questions, or just want to chat about your properties. Remember, there's no such thing as a silly question - I'm here to make you feel confident and informed every step of the way. Let's start by adding your first property and watch the magic happen!`,
      icon: CheckCircle,
      color: 'from-emerald-400 to-blue-500',
      action: 'Let\'s create something amazing!'
    },
  ];

  const nextStep = () => {
    setIsTransitioning(true);
    setShowAgent(false);
    
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowAgent(true);
        setIsTransitioning(false);
      } else {
        navigate('/dashboard');
      }
    }, 500);
  };

  const skipOnboarding = () => {
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Building2 className="h-10 w-10 text-emerald-400" />
            <span className="text-2xl font-bold text-white">DeedAI Onboarding</span>
            <Sparkles className="h-6 w-6 text-amber-400" />
          </motion.div>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-emerald-400 to-blue-500 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!isTransitioning && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Step Icon and Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br ${currentStepData.color} shadow-2xl mb-6`}
                >
                  <currentStepData.icon className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentStepData.title}
                </h2>
              </motion.div>

              {/* AI Voice Agent */}
              {showAgent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <AIVoiceAgent
                    message={currentStepData.content}
                    isActive={true}
                    agentName="Your Personal DeedAI Assistant"
                    showVisualizer={true}
                  />
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <button
                  onClick={skipOnboarding}
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
                >
                  <span>Skip onboarding</span>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </button>

                <motion.button
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <Heart className="h-5 w-5" />
                  <span>{currentStepData.action}</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};