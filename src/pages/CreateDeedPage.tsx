import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FileText, 
  Upload, 
  MapPin, 
  DollarSign, 
  Camera,
  X,
  CheckCircle,
  Heart,
  Sparkles,
  Building,
  User,
  Shield,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';

interface PropertyFormData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  estimatedValue: number;
  description: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export const CreateDeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PropertyFormData>();

  const steps = [
    {
      title: 'Property Information',
      description: 'Tell us about your property',
      icon: Building,
      color: 'from-emerald-400 to-blue-500'
    },
    {
      title: 'Owner Details',
      description: 'Verify ownership information',
      icon: User,
      color: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Documents & Images',
      description: 'Upload supporting materials',
      icon: Camera,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Review & Generate',
      description: 'Create your blockchain deed',
      icon: Shield,
      color: 'from-amber-400 to-orange-500'
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mockUrls = files.map((_, index) => 
      `https://images.pexels.com/photos/${106399 + index}/pexels-photo-${106399 + index}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`
    );
    setUploadedImages([...uploadedImages, ...mockUrls]);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mockDocs = files.map(file => file.name);
    setUploadedDocuments([...uploadedDocuments, ...mockDocs]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Property data:', data);
    navigate('/deed/new-property');
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <FileText className="h-8 w-8 text-emerald-400" />
          <span>Create Property Deed</span>
          <Heart className="h-6 w-6 text-pink-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Transform your property into a secure, blockchain-verified digital deed with AI assistance ✨
        </p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-gradient-to-br ${step.color} shadow-lg` 
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
                  index < currentStep ? 'bg-gradient-to-r from-emerald-400 to-blue-500' : 'bg-gray-600'
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
            className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${currentStepData.color} shadow-lg`}
          >
            <currentStepData.icon className="h-6 w-6 text-white" />
            <span className="text-white font-semibold text-lg">{currentStepData.title}</span>
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Property Information */}
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Building className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-2xl font-semibold text-white">Property Information</h2>
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      {...register('address', { required: 'Address is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="San Francisco"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="CA"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="94102"
                    />
                    {errors.zipCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Type *
                    </label>
                    <select
                      {...register('propertyType', { required: 'Property type is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                    >
                      <option value="">Select Type</option>
                      <option value="residential">Residential 🏡</option>
                      <option value="commercial">Commercial 🏢</option>
                      <option value="industrial">Industrial 🏭</option>
                      <option value="land">Land 🌳</option>
                    </select>
                    {errors.propertyType && (
                      <p className="text-red-400 text-sm mt-1">{errors.propertyType.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Square Footage *
                    </label>
                    <input
                      type="number"
                      {...register('squareFootage', { required: 'Square footage is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="2000"
                    />
                    {errors.squareFootage && (
                      <p className="text-red-400 text-sm mt-1">{errors.squareFootage.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      {...register('bedrooms')}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      {...register('bathrooms')}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Value *
                    </label>
                    <input
                      type="number"
                      {...register('estimatedValue', { required: 'Estimated value is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="750000"
                    />
                    {errors.estimatedValue && (
                      <p className="text-red-400 text-sm mt-1">{errors.estimatedValue.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      placeholder="Describe the property's key features and condition..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Owner Details */}
            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <User className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Owner Information</h2>
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-400/20 mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Info className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-300 font-semibold">Ownership Verification</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This information will be used to verify your ownership and create the blockchain deed. 
                    All data is encrypted and secured with military-grade protection.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Legal Name *
                    </label>
                    <input
                      {...register('ownerName', { required: 'Owner name is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      placeholder="John Doe"
                    />
                    {errors.ownerName && (
                      <p className="text-red-400 text-sm mt-1">{errors.ownerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('ownerEmail', { required: 'Email is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      placeholder="john@example.com"
                    />
                    {errors.ownerEmail && (
                      <p className="text-red-400 text-sm mt-1">{errors.ownerEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('ownerPhone', { required: 'Phone number is required' })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                      placeholder="(555) 123-4567"
                    />
                    {errors.ownerPhone && (
                      <p className="text-red-400 text-sm mt-1">{errors.ownerPhone.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Documents & Images */}
            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Camera className="h-6 w-6 text-purple-400" />
                  <h2 className="text-2xl font-semibold text-white">Documents & Images</h2>
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Property Images
                  </label>
                  <div className="border-2 border-dashed border-purple-400/30 rounded-xl p-8 text-center bg-purple-500/5">
                    <Camera className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">
                      Upload beautiful photos of your property 📸
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Select Images</span>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {uploadedImages.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={image}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Legal Documents
                  </label>
                  <div className="border-2 border-dashed border-emerald-400/30 rounded-xl p-8 text-center bg-emerald-500/5">
                    <FileText className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">
                      Upload deeds, titles, and other legal documents 📄
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 cursor-pointer inline-flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Select Documents</span>
                    </label>
                  </div>

                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {uploadedDocuments.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-emerald-400" />
                            <span className="text-white font-medium">{doc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
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
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-6 w-6 text-amber-400" />
                  <h2 className="text-2xl font-semibold text-white">Review & Generate Deed</h2>
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-400/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="h-5 w-5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Ready to Create Your Deed!</span>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Your property information has been collected and verified. Our AI will now generate 
                    a comprehensive digital deed and record it on the Algorand blockchain for maximum security.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Property Address:</span>
                      <span className="text-white font-medium">{watch('address')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Property Type:</span>
                      <span className="text-white font-medium">{watch('propertyType')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Value:</span>
                      <span className="text-emerald-400 font-semibold">
                        ${watch('estimatedValue')?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Owner:</span>
                      <span className="text-white font-medium">{watch('ownerName')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Images:</span>
                      <span className="text-purple-400 font-medium">{uploadedImages.length} uploaded</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Documents:</span>
                      <span className="text-blue-400 font-medium">{uploadedDocuments.length} uploaded</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span>What Happens Next?</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      'AI analyzes your property data and generates deed terms',
                      'Smart contract is deployed on Algorand blockchain',
                      'Property NFT is minted with your ownership details',
                      'Digital deed is created and secured forever'
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 text-gray-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              type="button"
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

            {currentStep === steps.length - 1 ? (
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Deed...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    <span>Generate Blockchain Deed</span>
                    <Heart className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};