import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { deedService } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AIVoiceAgent } from '../components/AIVoiceAgent';
import {
  FileText,
  Shield,
  Sparkles,
  Heart,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  Building,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Zap
} from 'lucide-react';

interface DeedFormData {
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  legalDescription: string;
  ownerName: string;
  ownershipPercentage: number;
  purchasePrice: number;
  purchaseDate: string;
  deedType: string;
  specialConditions: string;
}

export const DeedGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DeedFormData>({
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Residential',
    legalDescription: '',
    ownerName: user?.full_name || '',
    ownershipPercentage: 100,
    purchasePrice: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    deedType: 'Warranty Deed',
    specialConditions: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [generatedDeed, setGeneratedDeed] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const steps = [
    {
      title: 'Property Information',
      description: 'Basic property details',
      icon: Building,
      color: 'from-emerald-400 to-blue-500'
    },
    {
      title: 'Ownership Details',
      description: 'Owner and ownership information',
      icon: User,
      color: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Legal Information',
      description: 'Legal descriptions and conditions',
      icon: FileText,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Review & Generate',
      description: 'Review and create your deed',
      icon: Shield,
      color: 'from-amber-400 to-orange-500'
    }
  ];

  const handleInputChange = (field: keyof DeedFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateDeed = async () => {
    if (!user?.id) return;

    try {
      setIsGenerating(true);
      setShowAIAgent(true);

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const deedData = {
        ...formData,
        generatedAt: new Date().toISOString(),
        deedId: `DEED_${Date.now()}`,
        blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        nftTokenId: `NFT_${Date.now()}`
      };

      const result = await deedService.generateDeed('mock-property-id', user.id, deedData);
      setGeneratedDeed(result);

      // Simulate AI verification
      setTimeout(() => {
        const confidence = Math.random() * 20 + 80;
        setVerificationResult({
          status: confidence > 85 ? 'verified' : 'needs_review',
          confidence: confidence,
          issues: confidence < 85 ? ['Minor formatting inconsistency detected'] : [],
          recommendations: ['Consider adding property survey reference', 'Include notarization details']
        });
      }, 2000);

    } catch (error) {
      console.error('Error generating deed:', error);
      alert('Failed to generate deed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <FileText className="h-8 w-8 text-emerald-400" />
          <span>AI Deed Generator</span>
          <Heart className="h-6 w-6 text-pink-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Create professional, legally-compliant property deeds with AI assistance ✨
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-linear-to-br ${step.color} shadow-lg` 
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <step.icon className="h-8 w-8 text-white" />
                )}
              </motion.div>
              <div className="ml-4 hidden md:block">
                <p className={`font-semibold ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className={`text-sm ${
                  index <= currentStep ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 rounded-full transition-all duration-300 ${
                  index < currentStep ? 'bg-linear-to-r from-emerald-400 to-blue-500' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-linear-to-r ${currentStepData.color} shadow-lg`}
          >
            <currentStepData.icon className="h-6 w-6 text-white" />
            <span className="text-white font-semibold text-lg">{currentStepData.title}</span>
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Property Information */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Building className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-2xl font-semibold text-white">Property Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Address *
                    </label>
                    <input
                      type="text"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="CA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="94102"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Property Type *
                      </label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange('propertyType', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Ownership Details */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Ownership Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ownership Percentage *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.ownershipPercentage}
                        onChange={(e) => handleInputChange('ownershipPercentage', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Purchase Price *
                      </label>
                      <input
                        type="number"
                        value={formData.purchasePrice}
                        onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        placeholder="500000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Purchase Date *
                      </label>
                      <input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Deed Type *
                      </label>
                      <select
                        value={formData.deedType}
                        onChange={(e) => handleInputChange('deedType', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-hidden focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      >
                        <option value="Warranty Deed">Warranty Deed</option>
                        <option value="Quitclaim Deed">Quitclaim Deed</option>
                        <option value="Grant Deed">Grant Deed</option>
                        <option value="Fractional Ownership Deed">Fractional Ownership Deed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Legal Information */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <FileText className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">Legal Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Legal Description *
                    </label>
                    <textarea
                      value={formData.legalDescription}
                      onChange={(e) => handleInputChange('legalDescription', e.target.value)}
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      placeholder="Lot 1, Block 2, Subdivision Name, as recorded in Map Book 123, Page 45, Official Records of [County] County, [State]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Special Conditions or Restrictions
                    </label>
                    <textarea
                      value={formData.specialConditions}
                      onChange={(e) => handleInputChange('specialConditions', e.target.value)}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      placeholder="Any special conditions, easements, or restrictions..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review & Generate */}
            {currentStep === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-semibold text-white">Review & Generate</h2>
                </div>

                <div className="bg-linear-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-400/20">
                  <h3 className="text-white font-semibold text-lg mb-4">Deed Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Property:</span>
                        <span className="text-white">{formData.propertyAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Owner:</span>
                        <span className="text-white">{formData.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ownership:</span>
                        <span className="text-white">{formData.ownershipPercentage}%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{formData.deedType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Purchase Price:</span>
                        <span className="text-emerald-400">${formData.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{new Date(formData.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={generateDeed}
                  disabled={isGenerating}
                  whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                  whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                  className="w-full bg-linear-to-r from-emerald-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Generating Deed...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Generate AI Deed</span>
                      <Sparkles className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!generatedDeed && (
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                whileHover={{ scale: currentStep === 0 ? 1 : 1.02 }}
                whileTap={{ scale: currentStep === 0 ? 1 : 0.98 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 0
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                Previous
              </motion.button>

              {currentStep < steps.length - 1 && (
                <motion.button
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* AI Assistant & Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* AI Voice Agent */}
          {showAIAgent && (
            <AIVoiceAgent
              message="I'm analyzing your property information and generating a comprehensive legal deed. This process includes validating all details, ensuring legal compliance, and creating a blockchain-ready document that will protect your ownership rights forever."
              isActive={true}
              agentName="DeedAI Legal Assistant"
              showVisualizer={true}
            />
          )}

          {/* Generated Deed Preview */}
          {generatedDeed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-emerald-400" />
                  <span>Generated Deed</span>
                </h2>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold text-lg mb-4 text-center">
                  PROPERTY DEED
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-white/10 pb-2">
                    <strong className="text-emerald-400">Property Address:</strong>
                    <p className="text-white">{formData.propertyAddress}, {formData.city}, {formData.state} {formData.zipCode}</p>
                  </div>
                  <div className="border-b border-white/10 pb-2">
                    <strong className="text-blue-400">Owner:</strong>
                    <p className="text-white">{formData.ownerName}</p>
                  </div>
                  <div className="border-b border-white/10 pb-2">
                    <strong className="text-purple-400">Ownership Percentage:</strong>
                    <p className="text-white">{formData.ownershipPercentage}%</p>
                  </div>
                  <div className="border-b border-white/10 pb-2">
                    <strong className="text-amber-400">Purchase Price:</strong>
                    <p className="text-white">${formData.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <strong className="text-pink-400">Blockchain Hash:</strong>
                    <p className="text-white font-mono text-xs">{generatedDeed.blockchain_hash}</p>
                  </div>
                </div>
              </div>

              {/* Verification Results */}
              {verificationResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-6 border ${
                    verificationResult.status === 'verified'
                      ? 'bg-emerald-500/10 border-emerald-400/20'
                      : 'bg-amber-500/10 border-amber-400/20'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {verificationResult.status === 'verified' ? (
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-amber-400" />
                    )}
                    <h3 className={`font-semibold text-lg ${
                      verificationResult.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      AI Verification Complete
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Confidence Score:</span>
                      <span className={`font-bold ${
                        verificationResult.confidence > 90 ? 'text-emerald-400' : 
                        verificationResult.confidence > 80 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {verificationResult.confidence.toFixed(1)}%
                      </span>
                    </div>
                    
                    {verificationResult.issues.length > 0 && (
                      <div>
                        <span className="text-gray-300 text-sm">Issues Found:</span>
                        <ul className="list-disc list-inside text-amber-300 text-sm mt-1">
                          {verificationResult.issues.map((issue: string, index: number) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <span className="text-gray-300 text-sm">Recommendations:</span>
                      <ul className="list-disc list-inside text-blue-300 text-sm mt-1">
                        {verificationResult.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-linear-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Deed</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/10 border border-white/20 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Mint NFT</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};