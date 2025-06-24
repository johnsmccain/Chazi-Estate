import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Calculator, 
  DollarSign, 
  TrendingUp,
  Heart,
  Sparkles,
  Shield,
  CheckCircle,
  Clock,
  Building,
  Percent,
  Calendar,
  FileText,
  ArrowRight,
  Info
} from 'lucide-react';

interface LoanOption {
  id: string;
  name: string;
  type: string;
  interestRate: string;
  term: string;
  maxLTV: string;
  minDownPayment: string;
  description: string;
  features: string[];
  color: string;
}

export const LoanPropertyPage: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [showCalculator, setShowCalculator] = useState(true);

  // Mock loan options
  const loanOptions: LoanOption[] = [
    {
      id: '1',
      name: 'DeedAI Smart Loan',
      type: 'Blockchain-Secured',
      interestRate: '3.25%',
      term: '30 years',
      maxLTV: '80%',
      minDownPayment: '20%',
      description: 'Revolutionary blockchain-secured mortgage with smart contract automation',
      features: [
        'Instant pre-approval',
        'Smart contract execution',
        'Reduced closing costs',
        'Transparent process'
      ],
      color: 'from-emerald-400 to-blue-500'
    },
    {
      id: '2',
      name: 'Traditional Fixed Rate',
      type: 'Conventional',
      interestRate: '4.15%',
      term: '30 years',
      maxLTV: '95%',
      minDownPayment: '5%',
      description: 'Classic fixed-rate mortgage with predictable monthly payments',
      features: [
        'Fixed monthly payments',
        'No PMI with 20% down',
        'Established process',
        'Wide lender network'
      ],
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: '3',
      name: 'Fractional Financing',
      type: 'Innovative',
      interestRate: '2.95%',
      term: '15 years',
      maxLTV: '70%',
      minDownPayment: '30%',
      description: 'Perfect for fractional property ownership with flexible terms',
      features: [
        'Fractional ownership support',
        'Lower interest rates',
        'Flexible payment terms',
        'Co-investment options'
      ],
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: '4',
      name: 'Investment Property Loan',
      type: 'Commercial',
      interestRate: '5.25%',
      term: '25 years',
      maxLTV: '75%',
      minDownPayment: '25%',
      description: 'Specialized financing for investment and rental properties',
      features: [
        'Investment property focus',
        'Rental income consideration',
        'Portfolio lending',
        'Tax advantages'
      ],
      color: 'from-amber-400 to-orange-500'
    }
  ];

  const calculateLoanDetails = () => {
    if (!propertyValue || !downPayment || !selectedLoan) return null;

    const value = parseFloat(propertyValue.replace(/[$,]/g, ''));
    const down = parseFloat(downPayment.replace(/[$,]/g, ''));
    const loanAmount = value - down;
    const rate = parseFloat(selectedLoan.interestRate.replace('%', '')) / 100 / 12;
    const months = parseInt(selectedLoan.term.split(' ')[0]) * 12;
    
    const monthlyPayment = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    
    return {
      loanAmount,
      monthlyPayment,
      totalInterest: (monthlyPayment * months) - loanAmount,
      ltv: (loanAmount / value) * 100
    };
  };

  const loanDetails = calculateLoanDetails();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <CreditCard className="h-8 w-8 text-blue-400" />
          <span>Property Financing</span>
          <Heart className="h-6 w-6 text-pink-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Get the best financing options for your property with blockchain-powered smart loans ✨
        </p>
      </motion.div>

      {/* Loan Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">Loan Calculator</h2>
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-blue-300 hover:text-blue-200 transition-colors"
          >
            {showCalculator ? 'Hide' : 'Show'} Calculator
          </button>
        </div>

        <AnimatePresence>
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="block text-blue-300 text-sm font-medium mb-2">
                    Property Value
                  </label>
                  <input
                    type="text"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    placeholder="$500,000"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="block text-emerald-300 text-sm font-medium mb-2">
                    Down Payment
                  </label>
                  <input
                    type="text"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    placeholder="$100,000"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
              </div>

              {loanDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-4 border border-emerald-400/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300 text-sm font-medium">Loan Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${loanDetails.loanAmount.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-300 text-sm font-medium">Monthly Payment</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">
                      ${loanDetails.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Percent className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-medium">LTV Ratio</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                      {loanDetails.ltv.toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-400/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-300 text-sm font-medium">Total Interest</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-400">
                      ${loanDetails.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loan Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {loanOptions.map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group cursor-pointer"
            onClick={() => setSelectedLoan(loan)}
          >
            <div className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${
              selectedLoan?.id === loan.id 
                ? 'border-blue-400/50 shadow-blue-500/25' 
                : 'border-white/20 hover:border-blue-400/30'
            }`}>
              {/* Loan Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${loan.color} shadow-lg`}>
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">{loan.name}</h3>
                    <p className="text-gray-300 text-sm">{loan.type}</p>
                  </div>
                </div>
                {selectedLoan?.id === loan.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-blue-400"
                  >
                    <CheckCircle className="h-6 w-6" />
                  </motion.div>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Percent className="h-4 w-4 text-emerald-400" />
                    <span className="text-gray-300 text-sm">Interest Rate</span>
                  </div>
                  <p className="text-emerald-400 font-bold text-xl">{loan.interestRate}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300 text-sm">Term</span>
                  </div>
                  <p className="text-blue-400 font-bold text-xl">{loan.term}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">Max LTV</span>
                  </div>
                  <p className="text-purple-400 font-bold text-xl">{loan.maxLTV}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-amber-400" />
                    <span className="text-gray-300 text-sm">Min Down</span>
                  </div>
                  <p className="text-amber-400 font-bold text-xl">{loan.minDownPayment}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {loan.description}
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white font-semibold flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Key Features</span>
                </h4>
                <div className="space-y-2">
                  {loan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                  selectedLoan?.id === loan.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-blue-500 hover:to-purple-600'
                }`}
              >
                <span>{selectedLoan?.id === loan.id ? 'Selected' : 'Select Loan'}</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Application Process */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-semibold text-white">Application Process</h2>
          <Sparkles className="h-5 w-5 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Pre-Qualification', description: 'Quick assessment of your financial situation', icon: Calculator },
            { step: 2, title: 'Document Upload', description: 'Secure blockchain-verified document submission', icon: FileText },
            { step: 3, title: 'Smart Contract', description: 'Automated loan processing with smart contracts', icon: Shield },
            { step: 4, title: 'Funding', description: 'Instant funding upon approval', icon: CheckCircle }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {selectedLoan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <CreditCard className="h-5 w-5" />
              <span>Start Application with {selectedLoan.name}</span>
              <Heart className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-lg border border-emerald-400/20 rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Shield className="h-8 w-8 text-emerald-400" />
            <span>Why Choose DeedAI Financing?</span>
            <Heart className="h-6 w-6 text-pink-400" />
          </h2>
          <p className="text-xl text-gray-300">
            Revolutionary blockchain technology meets traditional lending ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'Blockchain Security',
              description: 'All loan documents and transactions are secured on the blockchain for maximum transparency and security.',
              color: 'from-emerald-400 to-blue-500'
            },
            {
              icon: Clock,
              title: 'Instant Processing',
              description: 'Smart contracts automate the entire process, reducing approval times from weeks to hours.',
              color: 'from-blue-400 to-purple-500'
            },
            {
              icon: DollarSign,
              title: 'Lower Costs',
              description: 'Reduced overhead and automated processes mean lower fees and better rates for you.',
              color: 'from-purple-400 to-pink-500'
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-center"
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${benefit.color} shadow-lg mx-auto mb-4 w-16 h-16 flex items-center justify-center`}>
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};