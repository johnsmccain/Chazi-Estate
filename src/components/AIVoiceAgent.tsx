import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Mic, MicOff, Brain, Sparkles, Heart, Zap } from 'lucide-react';

interface AIVoiceAgentProps {
  message: string;
  isActive?: boolean;
  onComplete?: () => void;
  showVisualizer?: boolean;
  agentName?: string;
  personality?: 'friendly' | 'professional' | 'enthusiastic' | 'caring';
  avatar?: string;
  capabilities?: string[];
}

export const AIVoiceAgent: React.FC<AIVoiceAgentProps> = ({
  message,
  isActive = false,
  onComplete,
  showVisualizer = true,
  agentName = "DeedAI Assistant",
  personality = 'caring',
  avatar,
  capabilities = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [emotionalState, setEmotionalState] = useState<'neutral' | 'happy' | 'excited' | 'focused'>('neutral');
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const words = message.split(' ');

  const personalityConfig = {
    friendly: {
      colors: 'from-blue-400 to-emerald-500',
      emoji: '😊',
      voice: { rate: 0.9, pitch: 1.1 }
    },
    professional: {
      colors: 'from-slate-600 to-blue-600',
      emoji: '🤝',
      voice: { rate: 0.85, pitch: 1.0 }
    },
    enthusiastic: {
      colors: 'from-orange-400 to-pink-500',
      emoji: '🚀',
      voice: { rate: 1.0, pitch: 1.2 }
    },
    caring: {
      colors: 'from-emerald-400 to-blue-500',
      emoji: '💚',
      voice: { rate: 0.8, pitch: 1.1 }
    }
  };

  const currentPersonality = personalityConfig[personality];

  useEffect(() => {
    if (isActive && !isMuted) {
      startAIProcessing();
    }
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [isActive, message, isMuted]);

  const startAIProcessing = async () => {
    setIsThinking(true);
    setEmotionalState('focused');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate AI insights
    const insights = generateAIInsights(message);
    setAiInsights(insights);
    
    setIsThinking(false);
    setEmotionalState('happy');
    
    if (!isMuted) {
      startSpeaking();
    }
  };

  const generateAIInsights = (text: string): string[] => {
    const insights = [];
    
    if (text.toLowerCase().includes('property')) {
      insights.push('🏠 Analyzing property market trends');
    }
    if (text.toLowerCase().includes('investment')) {
      insights.push('📈 Calculating optimal investment strategies');
    }
    if (text.toLowerCase().includes('legal') || text.toLowerCase().includes('deed')) {
      insights.push('⚖️ Reviewing legal compliance requirements');
    }
    if (text.toLowerCase().includes('blockchain')) {
      insights.push('🔗 Verifying blockchain security protocols');
    }
    
    insights.push('🧠 Processing with advanced neural networks');
    insights.push('💡 Generating personalized recommendations');
    
    return insights;
  };

  const startSpeaking = () => {
    if (isMuted) return;
    
    setIsPlaying(true);
    setEmotionalState('excited');
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = currentPersonality.voice.rate;
    utterance.pitch = currentPersonality.voice.pitch;
    
    // Try to find a suitable voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.lang.includes('en-US')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Word-by-word highlighting
    const wordDuration = (utterance.text.length / words.length) * 80;
    let wordIndex = 0;
    
    const wordInterval = setInterval(() => {
      if (wordIndex < words.length) {
        setCurrentWord(wordIndex);
        wordIndex++;
      } else {
        clearInterval(wordInterval);
      }
    }, wordDuration);

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentWord(0);
      setEmotionalState('happy');
      clearInterval(wordInterval);
      onComplete?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentWord(0);
      setEmotionalState('neutral');
      clearInterval(wordInterval);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying && utteranceRef.current) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentWord(0);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setEmotionalState('focused');
      // In production, this would start speech recognition
      setTimeout(() => {
        setIsListening(false);
        setEmotionalState('happy');
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-gradient-to-br ${currentPersonality.colors}/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${currentPersonality.colors} rounded-full opacity-30`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Agent Header */}
      <div className="flex items-center space-x-4 mb-6 relative z-10">
        <div className="relative">
          <motion.div
            animate={
              isThinking 
                ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                : isPlaying 
                ? { scale: [1, 1.05, 1] } 
                : {}
            }
            transition={{ 
              duration: isThinking ? 0.8 : 1, 
              repeat: (isThinking || isPlaying) ? Infinity : 0 
            }}
            className={`w-20 h-20 bg-gradient-to-br ${currentPersonality.colors} rounded-2xl flex items-center justify-center shadow-2xl relative`}
          >
            {avatar ? (
              <img src={avatar} alt={agentName} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <motion.div
                animate={isThinking ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: isThinking ? Infinity : 0, ease: "linear" }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
              >
                {isThinking ? (
                  <Brain className="h-8 w-8 text-white" />
                ) : (
                  <div className="text-2xl">{currentPersonality.emoji}</div>
                )}
              </motion.div>
            )}
            
            {/* Emotional State Indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              animate={{
                backgroundColor: emotionalState === 'happy' ? '#10B981' : 
                                emotionalState === 'excited' ? '#F59E0B' :
                                emotionalState === 'focused' ? '#3B82F6' : '#6B7280'
              }}
            >
              {emotionalState === 'happy' && '😊'}
              {emotionalState === 'excited' && '🤩'}
              {emotionalState === 'focused' && '🤔'}
              {emotionalState === 'neutral' && '😌'}
            </motion.div>
          </motion.div>
          
          {/* Voice Visualizer */}
          {showVisualizer && (isPlaying || isThinking) && (
            <div className="absolute -right-3 -bottom-3">
              <div className="flex space-x-1">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 bg-gradient-to-t ${currentPersonality.colors} rounded-full`}
                    animate={{ 
                      height: isThinking ? [4, 8, 4] : [4, 16, 4] 
                    }}
                    transition={{
                      duration: isThinking ? 1.2 : 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-xl mb-1 flex items-center space-x-2">
            <span>{agentName}</span>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </h3>
          <p className={`text-sm font-medium ${
            isThinking ? 'text-blue-300' :
            isPlaying ? 'text-emerald-300' : 
            isListening ? 'text-purple-300' : 'text-gray-300'
          }`}>
            {isThinking ? 'Analyzing with AI...' :
             isPlaying ? 'Speaking with care...' : 
             isListening ? 'Listening attentively...' : 'Ready to help you'}
          </p>
          
          {/* Capabilities */}
          {capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {capabilities.slice(0, 3).map((capability, idx) => (
                <span key={idx} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded-full">
                  {capability}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={toggleMute}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isMuted 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isListening 
                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
            }`}
          >
            {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* AI Insights */}
      <AnimatePresence>
        {isThinking && aiInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-400" />
              <span>AI Processing</span>
            </h4>
            <div className="space-y-2">
              {aiInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.3 }}
                  className="text-sm text-gray-300 flex items-center space-x-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full"
                  />
                  <span>{insight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message with Word Highlighting */}
      <div className="bg-white/5 rounded-xl p-6 mb-6 relative z-10">
        <p className="text-white leading-relaxed text-lg">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={`${
                isPlaying && index === currentWord
                  ? `bg-gradient-to-r ${currentPersonality.colors}/30 text-white px-1 rounded`
                  : 'text-gray-200'
              } transition-all duration-200`}
              animate={
                isPlaying && index === currentWord
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              {word}{' '}
            </motion.span>
          ))}
        </p>
      </div>

      {/* Status Indicator */}
      <AnimatePresence>
        {(isPlaying || isThinking || isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center space-x-3 text-sm relative z-10"
          >
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 bg-gradient-to-r ${currentPersonality.colors} rounded-full`}
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className={`font-medium ${
              isThinking ? 'text-blue-300' :
              isPlaying ? 'text-emerald-300' : 'text-purple-300'
            }`}>
              {isThinking ? 'AI is analyzing your request with deep learning...' :
               isPlaying ? 'Speaking with warmth and intelligence...' : 
               'Listening with advanced speech recognition...'}
            </span>
            <Heart className="h-4 w-4 text-pink-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};