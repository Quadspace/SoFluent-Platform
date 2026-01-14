/**
 * Location Selector Component
 * Allows users to manually select their market for pricing
 */

import React, { useState } from 'react';
import { Globe, MapPin } from 'lucide-react';
import { useLocationPricing } from '../../hooks/useLocationPricing';
import { motion, AnimatePresence } from 'framer-motion';

const MARKET_INFO = {
  'BR': {
    name: 'Brasil',
    flag: '🇧🇷',
    currency: 'BRL',
    symbol: 'R$'
  },
  'US': {
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$'
  },
  'EU': {
    name: 'Europe',
    flag: '🇪🇺',
    currency: 'EUR',
    symbol: '€'
  }
};

const LocationSelector = () => {
  const { market, setMarket, markets } = useLocationPricing();
  const [isOpen, setIsOpen] = useState(false);

  const currentMarket = MARKET_INFO[market] || MARKET_INFO['US'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all backdrop-blur-sm"
        aria-label="Select location for pricing"
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-semibold">{currentMarket.flag} {currentMarket.name}</span>
        <Globe className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 bg-[#1A1A1A] border border-white/20 rounded-lg shadow-xl overflow-hidden z-50 min-w-[200px]"
            >
              {markets.map((mkt) => {
                const info = MARKET_INFO[mkt];
                if (!info) return null;
                
                return (
                  <button
                    key={mkt}
                    onClick={() => {
                      setMarket(mkt);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors flex items-center gap-3 ${
                      market === mkt
                        ? 'bg-[#E91E63]/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{info.flag}</span>
                    <div className="flex-1">
                      <div>{info.name}</div>
                      <div className="text-xs text-gray-400">{info.symbol} {info.currency}</div>
                    </div>
                    {market === mkt && (
                      <div className="w-2 h-2 bg-[#E91E63] rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;
