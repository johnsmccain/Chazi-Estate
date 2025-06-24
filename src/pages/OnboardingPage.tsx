import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Building2, User, Shield, Zap, CheckCircle, Sparkles } from 'lucide-react';

// Import new components
import { ProgressBar } from '../components/onboarding/ProgressBar';
import { StepContent } from '../components/onboarding/StepContent';
import { NavigationButtons } from '../components/onboarding/NavigationButtons';

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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center space-x-2 lg:space-x-3 mb-4"
          >
            <Building2 className="h-8 w-8 lg:h-10 lg:w-10 text-emerald-400" />
            <span className="text-xl lg:text-2xl font-bold text-white">DeedAI Onboarding</span>
            <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-amber-400" />
          </motion.div>
          
          <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
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
              className="space-y-6 lg:space-y-8"
            >
              <StepContent step={currentStepData} showAgent={showAgent} />
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                actionText={currentStepData.action}
                onNext={nextStep}
                onSkip={skipOnboarding}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 lg:w-2 lg:h-2 bg-emerald-400/30 rounded-full"
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