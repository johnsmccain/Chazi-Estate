import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { OnboardingStep } from '../../types';

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: '1',
      title: 'Welcome to DeedAI',
      description: 'Your AI-powered real estate assistant is here to guide you through the revolutionary world of blockchain property ownership.',
      completed: false,
    },
    {
      id: '2',
      title: 'How It Works',
      description: 'We use advanced AI to generate legal deeds and secure them on the Algorand blockchain, creating tamper-proof property records.',
      completed: false,
    },
    {
      id: '3',
      title: 'Upload Your Property',
      description: 'Simply provide your property details, images, and documents. Our AI will handle the complex deed generation process.',
      completed: false,
    },
    {
      id: '4',
      title: 'AI Verification',
      description: 'Our AI agents will verify your identity and property details, ensuring everything meets legal standards.',
      completed: false,
    },
    {
      id: '5',
      title: 'Blockchain Security',
      description: 'Your property deed is minted as an NFT on Algorand, providing immutable proof of ownership.',
      completed: false,
    },
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (audioEnabled) {
      simulateVoiceGreeting();
    }
  }, [currentStep, audioEnabled]);

  const simulateVoiceGreeting = async () => {
    setIsSpeaking(true);
    // Simulate ElevenLabs voice generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSpeaking(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-700">Onboarding Progress</h2>
            <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{currentStepData.title}</h1>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Voice Controls */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-3 rounded-full transition-all ${
                      audioEnabled
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                    }`}
                  >
                    {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className="text-sm text-gray-600">
                        {isSpeaking ? 'AI Agent is speaking...' : 'AI Agent ready'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-full transition-all ${
                      isListening
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleNext}
                  className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 space-x-2"
                >
                  <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mx-auto flex items-center justify-center">
                    <motion.div
                      animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Volume2 className="h-12 w-12 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">AI Agent Active</h3>
                  <p className="text-gray-600">Powered by ElevenLabs Voice AI</p>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl opacity-20"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg opacity-20"
              />
            </motion.div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mt-8 flex justify-center space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};