import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Property, propertyService, formatCurrency } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PropertyDetails } from '../components/PropertyDetails';
import { InvestmentCalculator } from '../components/InvestmentCalculator';
import { PurchaseActions } from '../components/PurchaseActions';
import { PropertyNotFound } from '../components/PropertyNotFound';
import { 
  ArrowLeft, 
  PieChart,
  Heart,
  Sparkles
} from 'lucide-react';

export const BuyFractionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [calculatedShares, setCalculatedShares] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    if (property && investmentAmount > 0 && property.share_price) {
      const shares = Math.floor(investmentAmount / property.share_price);
      setCalculatedShares(shares);
    } else {
      setCalculatedShares(0);
    }
  }, [investmentAmount, property]);

  const fetchProperty = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await propertyService.getProperty(id);
      
      if (!data || !data.fraction_available) {
        setProperty(null);
      } else {
        setProperty(data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!property || !user || calculatedShares === 0) return;

    setPurchasing(true);
    try {
      const totalAmount = calculatedShares * (property.share_price || 0);
      
      await propertyService.purchaseShares(
        property.id, 
        user.id, 
        calculatedShares, 
        totalAmount
      );

      navigate('/my-properties', { 
        state: { 
          message: `Successfully purchased ${calculatedShares} shares of ${property.title}!` 
        }
      });
    } catch (error) {
      console.error('Error purchasing shares:', error);
      alert('Failed to purchase shares. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading property details..." size="lg" />
      </div>
    );
  }

  if (!property) {
    return <PropertyNotFound />;
  }

  const totalInvestment = calculatedShares * (property.share_price || 0);
  const ownershipPercentage = property.total_shares ? (calculatedShares / property.total_shares) * 100 : 0;
  const projectedAnnualReturn = (totalInvestment * (property.expected_return || 0)) / 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors bg-white/10 rounded-xl px-4 py-2 border border-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
              <PieChart className="h-8 w-8 text-purple-400" />
              <span>Buy Property Fraction</span>
              <Heart className="h-6 w-6 text-pink-400" />
            </h1>
            <p className="text-gray-300 mt-1">
              Invest in fractional real estate ownership ✨
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Details */}
        <PropertyDetails property={property} />

        {/* Investment Calculator */}
        <div className="space-y-6">
          <InvestmentCalculator
            property={property}
            investmentAmount={investmentAmount}
            onInvestmentChange={setInvestmentAmount}
            calculatedShares={calculatedShares}
            ownershipPercentage={ownershipPercentage}
            projectedReturn={projectedAnnualReturn}
            totalInvestment={totalInvestment}
          />

          {/* Purchase Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <PurchaseActions
              calculatedShares={calculatedShares}
              isAuthenticated={!!user}
              isPurchasing={purchasing}
              onPurchase={handlePurchase}
              totalInvestment={totalInvestment}
              formatCurrency={formatCurrency}
            />
          </motion.div>
        </div>
      </div>

      {/* Additional Property Information */}
      {property.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <h3 className="text-xl font-semibold text-white">About This Property</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">{property.description}</p>
        </motion.div>
      )}
    </div>
  );
};