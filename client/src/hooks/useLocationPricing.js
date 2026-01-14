/**
 * Location-Based Pricing Hook
 * Detects user location and returns appropriate pricing for their market
 */

import { useState, useEffect } from 'react';

// Pricing tiers by market (in local currency)
const PRICING_BY_MARKET = {
  'BR': {
    currency: 'BRL',
    symbol: 'R$',
    free: {
      price: 0,
      display: 'Grátis'
    },
    academy: {
      price: 297,
      display: 'R$ 297',
      period: '/mês'
    },
    vip: {
      price: 997,
      display: 'R$ 997',
      period: '/mês'
    }
  },
  'US': {
    currency: 'USD',
    symbol: '$',
    free: {
      price: 0,
      display: 'Free'
    },
    academy: {
      price: 49,
      display: '$49',
      period: '/month'
    },
    vip: {
      price: 149,
      display: '$149',
      period: '/month'
    }
  },
  'EU': {
    currency: 'EUR',
    symbol: '€',
    free: {
      price: 0,
      display: 'Gratis'
    },
    academy: {
      price: 45,
      display: '€45',
      period: '/month'
    },
    vip: {
      price: 135,
      display: '€135',
      period: '/month'
    }
  },
  'DEFAULT': {
    currency: 'USD',
    symbol: '$',
    free: {
      price: 0,
      display: 'Free'
    },
    academy: {
      price: 49,
      display: '$49',
      period: '/month'
    },
    vip: {
      price: 149,
      display: '$149',
      period: '/month'
    }
  }
};

// Market detection based on IP/timezone/currency
const detectMarket = () => {
  // Try multiple methods to detect market
  
  // 1. Check localStorage for saved preference
  const savedMarket = localStorage.getItem('sofluent_market');
  if (savedMarket && PRICING_BY_MARKET[savedMarket]) {
    return savedMarket;
  }
  
  // 2. Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('pt')) {
    return 'BR';
  }
  
  // 3. Check timezone (rough detection)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes('America/Sao_Paulo') || timezone.includes('America/Fortaleza')) {
    return 'BR';
  }
  if (timezone.includes('Europe/')) {
    return 'EU';
  }
  if (timezone.includes('America/') && !timezone.includes('Sao_Paulo')) {
    return 'US';
  }
  
  // 4. Default to US
  return 'US';
};

export const useLocationPricing = () => {
  const [market, setMarket] = useState('US');
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState(PRICING_BY_MARKET.DEFAULT);

  useEffect(() => {
    // First, use basic detection
    const detectedMarket = detectMarket();
    setMarket(detectedMarket);
    setPricing(PRICING_BY_MARKET[detectedMarket] || PRICING_BY_MARKET.DEFAULT);
    
    // Then fetch more accurate location from IP service
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const countryCode = data.country_code;
        
        // Map country codes to markets
        if (countryCode === 'BR') {
          setMarket('BR');
          setPricing(PRICING_BY_MARKET.BR);
        } else if (countryCode === 'US' || countryCode === 'CA' || countryCode === 'MX') {
          setMarket('US');
          setPricing(PRICING_BY_MARKET.US);
        } else if ([
          'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 
          'DK', 'FI', 'PL', 'PT', 'IE', 'GR', 'CZ', 'HU', 'RO', 'BG',
          'SK', 'SI', 'HR', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY'
        ].includes(countryCode)) {
          setMarket('EU');
          setPricing(PRICING_BY_MARKET.EU);
        }
        // Otherwise keep detected market from basic detection
        setLoading(false);
      })
      .catch(() => {
        // If IP detection fails, use basic detection
        setLoading(false);
      });
  }, []);

  const setMarketPreference = (newMarket) => {
    if (PRICING_BY_MARKET[newMarket]) {
      setMarket(newMarket);
      setPricing(PRICING_BY_MARKET[newMarket]);
      localStorage.setItem('sofluent_market', newMarket);
    }
  };

  return {
    market,
    pricing,
    loading,
    setMarket: setMarketPreference,
    markets: Object.keys(PRICING_BY_MARKET).filter(k => k !== 'DEFAULT')
  };
};

export default useLocationPricing;
