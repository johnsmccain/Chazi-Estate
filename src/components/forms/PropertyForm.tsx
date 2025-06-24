import React from 'react';
import { motion } from 'framer-motion';
import { Building, User, FileText, Shield, MapPin, DollarSign } from 'lucide-react';

interface PropertyFormProps {
  currentStep: number;
  register: any;
  errors: any;
  watch: any;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  currentStep,
  register,
  errors,
  watch
}) => {
  const steps = [
    {
      title: 'Property Information',
      icon: Building,
      color: 'from-emerald-400 to-blue-500'
    },
    {
      title: 'Ownership Details',
      icon: User,
      color: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Legal Information',
      icon: FileText,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Review & Generate',
      icon: Shield,
      color: 'from-amber-400 to-orange-500'
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <currentStepData.icon className="h-6 w-6 text-emerald-400" />
        <h2 className="text-2xl font-semibold text-white">{currentStepData.title}</h2>
      </div>

      {/* Step 0: Property Information */}
      {currentStep === 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
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
        </motion.div>
      )}

      {/* Additional steps would be implemented similarly */}
    </div>
  );
};