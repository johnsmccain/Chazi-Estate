import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgorand } from '../hooks/useAlgorand';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  FileText, 
  Video, 
  Shield, 
  Download,
  Play,
  Pause,
  Volume2,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

export const DeedGenerationPage: React.FC = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { mintPropertyNFT, verifyDeed, isLoading } = useAlgorand();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showDeedPreview, setShowDeedPreview] = useState(false);
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const steps = [
    {
      title: 'AI Analysis Complete! 🧠',
      description: 'Our AI has carefully analyzed your property documents and crafted perfect deed terms',
      status: 'completed',
      color: 'from-emerald-400 to-blue-500'
    },
    {
      title: 'Video Explanation Ready ✨',
      description: 'Your personal AI agent is ready to explain everything in a warm, friendly way',
      status: 'current',
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Blockchain Magic 🔗',
      description: 'Recording your deed on the Algorand blockchain with military-grade security',
      status: 'pending',
      color: 'from-blue-400 to-emerald-500'
    },
    {
      title: 'NFT Creation 🎨',
      description: 'Transforming your property into a beautiful, unique digital asset',
      status: 'pending',
      color: 'from-amber-400 to-orange-500'
    }
  ];

  // Mock property data
  const propertyData = {
    address: '123 Oak Street, San Francisco, CA 94102',
    type: 'Residential',
    value: '$850,000',
    sqft: '2,000',
    bedrooms: 3,
    bathrooms: 2
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleApproveTerms = async () => {
    setCurrentStep(2);
    
    try {
      // Mint NFT
      const mintResult = await mintPropertyNFT({
        address: propertyData.address,
        value: propertyData.value,
        sqft: propertyData.sqft,
        type: propertyData.type,
        images: []
      });

      if (mintResult.success) {
        setTransactionResult(mintResult);
        setCurrentStep(3);
        
        // Verify deed
        setTimeout(async () => {
          const verifyResult = await verifyDeed(propertyId || 'new-property');
          if (verifyResult.success) {
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error processing deed:', error);
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-400 animate-pulse" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-400/50 bg-emerald-400/10';
      case 'current':
        return 'border-blue-400/50 bg-blue-400/10';
      default:
        return 'border-gray-600/50 bg-gray-600/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2 flex items-center justify-center space-x-3"
          >
            <Sparkles className="h-8 w-8 text-amber-400" />
            <span>Deed Generation Magic</span>
            <Heart className="h-8 w-8 text-pink-400" />
          </motion.h1>
          <p className="text-gray-300 text-lg">
            Watch as AI and blockchain technology create your secure property deed! ✨
          </p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-amber-400" />
            <span>Generation Progress</span>
          </h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center space-x-6 p-6 rounded-2xl border transition-all duration-500 ${getStatusColor(getStepStatus(index))}`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(getStepStatus(index))}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
                {getStepStatus(index) === 'current' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color}`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tavus Video Agent */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Video className="h-6 w-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Your Personal AI Explanation</h2>
              <Heart className="h-5 w-5 text-pink-400" />
            </div>

            <div className="relative bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl overflow-hidden mb-6 shadow-inner">
              <div className="aspect-video flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!isVideoPlaying ? (
                    <motion.button
                      key="play-button"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVideo}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 backdrop-blur-lg border border-white/30 rounded-full p-6 hover:shadow-2xl transition-all duration-300"
                    >
                      <Play className="h-12 w-12 text-white ml-1" />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-6"
                      />
                      <p className="text-white text-lg font-medium">
                        Your AI agent is explaining your deed with care and warmth... 💜
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <motion.button
                  onClick={toggleVideo}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/20 backdrop-blur-lg rounded-full p-3 hover:bg-white/30 transition-colors"
                >
                  {isVideoPlaying ? (
                    <Pause className="h-5 w-5 text-white" />
                  ) : (
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  )}
                </motion.button>
                <div className="bg-white/20 backdrop-blur-lg rounded-full p-3">
                  <Volume2 className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-400/20">
              <h3 className="text-white font-medium mb-3 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Key Points Your AI Agent Covers:</span>
              </h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Property ownership transfer rights explained simply</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Blockchain verification process made easy</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>NFT tokenization benefits for your future</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Legal protections and your peace of mind</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Deed Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">Your Beautiful Digital Deed</h2>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Download className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-8 space-y-6 border border-emerald-400/20">
              <div className="text-center border-b border-white/10 pb-6">
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  ✨ DIGITAL PROPERTY DEED ✨
                </motion.h3>
                <p className="text-emerald-300 font-medium">Blockchain-Secured Ownership Record</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <span className="text-emerald-400 text-sm font-medium">Property Address:</span>
                  <p className="text-white font-semibold text-lg">{propertyData.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <span className="text-blue-400 text-sm font-medium">Type:</span>
                    <p className="text-white font-semibold">{propertyData.type}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <span className="text-purple-400 text-sm font-medium">Value:</span>
                    <p className="text-white font-semibold">{propertyData.value}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <span className="text-amber-400 text-sm font-medium">Square Footage:</span>
                  <p className="text-white font-semibold">{propertyData.sqft} sq ft</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Blockchain Protection Active</span>
                  <Heart className="h-4 w-4 text-pink-400" />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your deed is secured with love on the Algorand blockchain, ensuring 
                  your ownership is protected forever with immutable records and smart contract magic! 💫
                </p>
              </div>
            </div>

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-4"
              >
                <motion.button
                  onClick={handleApproveTerms}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" variant="blockchain" />
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      <span>I Love It! Record on Blockchain</span>
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
                <button
                  onClick={() => navigate('/upload')}
                  className="w-full bg-white/10 border border-white/20 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Request Gentle Modifications
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Algorand Integration Status */}
        {currentStep >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border border-emerald-400/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-8 w-8 text-emerald-400" />
              <h2 className="text-2xl font-semibold text-white">Blockchain Magic in Progress</h2>
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-400/20"
              >
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>Smart Contract</span>
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Algorand smart contract deployed with love for your property ownership verification
                </p>
                <div className="text-emerald-400 text-sm font-medium">✨ Deployed Successfully</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/20"
              >
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-400 animate-pulse" />
                  <span>NFT Token</span>
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Your property is being transformed into a beautiful, unique NFT on Algorand
                </p>
                <div className="text-purple-400 text-sm font-medium">🎨 Creating Magic...</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-400/20"
              >
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <span>Deed Record</span>
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Immutable ownership record being lovingly stored on the distributed ledger
                </p>
                <div className="text-amber-400 text-sm font-medium">⏳ Almost There...</div>
              </motion.div>
            </div>

            {transactionResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Transaction Successful!</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Asset ID: <span className="font-mono text-emerald-400">{transactionResult.assetId}</span>
                </p>
                <p className="text-gray-300 text-sm">
                  Transaction: <span className="font-mono text-blue-400">{transactionResult.transactionId}</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};