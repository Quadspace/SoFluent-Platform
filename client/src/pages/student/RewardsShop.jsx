/**
 * Rewards Shop Page
 * Top 1% Enhancement: Virtual currency rewards shop
 */

import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Coins,
  Filter,
  Star,
  Sparkles,
  Gift,
  Award,
  Zap
} from 'lucide-react';
import AnimatedButton from '../../components/common/AnimatedButton';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import StandardPage from '../../utils/pageConsistency';
import BrandText from '../../components/common/BrandText';
import { toast } from 'react-toastify';

const RewardsShop = () => {
  const { user } = useUserSafe();
  const { backendUrl, getToken } = useContext(AppContext);
  const [rewards, setRewards] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchRewards();
    fetchBalance();
  }, [categoryFilter]);

  const fetchRewards = async () => {
    try {
      const token = await getToken();
      if (token) {
        const params = categoryFilter !== 'all' ? `?category=${categoryFilter}` : '';
        const response = await fetch(`${backendUrl}/api/rewards${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setRewards(data.rewards || []);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use empty rewards array
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/coins/balance`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setBalance(data.balance || 0);
          }
        }
      }
    } catch (error) {
      // Handle error silently, use default balance
    }
  };

  const handlePurchase = async (rewardId, coinCost) => {
    if (balance < coinCost) {
      toast.error('Insufficient coins!');
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        const response = await fetch(`${backendUrl}/api/rewards/${rewardId}/purchase`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            toast.success(`Purchased ${data.reward.name}!`);
            setBalance(data.balance);
            fetchRewards(); // Refresh to update stock
          } else {
            toast.error(data.message || 'Purchase failed');
          }
        }
      }
    } catch (error) {
      // Error handled by useErrorHandler hook
      toast.error('Purchase failed');
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-[#D4AF37] to-[#E91E63]';
      case 'epic': return 'from-[#E91E63] to-[#C2185B]';
      case 'rare': return 'from-[#4CAF50] to-[#45A049]';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <StandardPage
        loading={true}
        seoTitle="Rewards Shop - So Fluent"
        background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
      />
    );
  }

  return (
    <StandardPage
      seoTitle="Rewards Shop - So Fluent"
      seoDescription="Spend your coins on exclusive rewards"
      background="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]"
    >
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Actay-Regular, sans-serif' }}>
              Rewards Shop
            </h1>
            <p className="text-xl text-gray-400">
              Spend your So Fluent Coins
            </p>
          </div>
          
          {/* Coin Balance */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-[#D4AF37] to-[#E91E63] rounded-2xl p-6 border border-[#D4AF37]/30"
          >
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-white" />
              <div>
                <p className="text-white/80 text-sm">Your Balance</p>
                <p className="text-3xl font-black text-white">{balance.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'cosmetics', 'features', 'courses', 'discounts'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                categoryFilter === category
                  ? 'bg-gradient-to-r from-[#E91E63] to-[#C2185B] text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward, index) => (
            <RewardCard
              key={reward._id}
              reward={reward}
              index={index}
              balance={balance}
              getRarityColor={getRarityColor}
              onPurchase={() => handlePurchase(reward._id, reward.coinCost)}
            />
          ))}
        </div>

        {rewards.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No rewards available</p>
          </div>
        )}
      </div>
    </StandardPage>
  );
};

const RewardCard = ({ reward, index, balance, getRarityColor, onPurchase }) => {
  const canAfford = balance >= reward.coinCost;
  const isOutOfStock = reward.stock !== null && reward.sold >= reward.stock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gradient-to-br ${getRarityColor(reward.rarity)} border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all relative`}
    >
      {/* Rarity Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold text-white capitalize">
          {reward.rarity}
        </span>
      </div>

      {/* Icon/Image */}
      <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center mb-4">
        {reward.icon ? (
          <span className="text-4xl">{reward.icon}</span>
        ) : (
          <Gift className="w-10 h-10 text-white" />
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
      {reward.description && (
        <p className="text-white/80 text-sm mb-4">{reward.description}</p>
      )}

      {/* Cost */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-2xl font-black text-white">{reward.coinCost.toLocaleString()}</span>
        </div>
        {reward.stock !== null && (
          <span className="text-white/60 text-sm">
            {reward.stock - reward.sold} left
          </span>
        )}
      </div>

      {/* Purchase Button */}
      <AnimatedButton
        onClick={onPurchase}
        variant={canAfford && !isOutOfStock ? 'primary' : 'outline'}
        size="md"
        className="w-full"
        disabled={!canAfford || isOutOfStock}
      >
        {isOutOfStock ? 'Out of Stock' : canAfford ? 'Purchase' : 'Not Enough Coins'}
      </AnimatedButton>
    </motion.div>
  );
};

export default RewardsShop;
