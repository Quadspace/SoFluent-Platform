/**
 * Payment Method Selector Component
 * Allows users to choose between Stripe (credit card) and Pix payment
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PixPayment from './PixPayment';
import StripeCheckout from './StripeCheckout';
import './PaymentMethodSelector.css';

const PaymentMethodSelector = ({ courseId, amount, onSuccess, onCancel }) => {
  const { t, i18n } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const isBrazil = i18n.language === 'pt-BR' || navigator.language.includes('pt-BR');

  // Auto-select Pix for Brazilian users
  if (!selectedMethod && isBrazil) {
    setSelectedMethod('pix');
  }

  if (selectedMethod === 'pix') {
    return (
      <PixPayment
        courseId={courseId}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={() => setSelectedMethod(null)}
      />
    );
  }

  if (selectedMethod === 'stripe') {
    return (
      <StripeCheckout
        courseId={courseId}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={() => setSelectedMethod(null)}
      />
    );
  }

  return (
    <div className="payment-method-selector">
      <h2 className="payment-title">{t('payment.selectMethod', 'Select Payment Method')}</h2>
      
      <div className="payment-methods">
        {/* Pix Option (Recommended for Brazil) */}
        {isBrazil && (
          <div 
            className={`payment-method-card ${selectedMethod === 'pix' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('pix')}
          >
            <div className="method-icon">💳</div>
            <div className="method-info">
              <h3>{t('payment.pix', 'Pix')}</h3>
              <p>{t('payment.pixDescription', 'Instant payment - Brazilian method')}</p>
              <span className="method-badge recommended">{t('payment.recommended', 'Recommended')}</span>
            </div>
            <div className="method-arrow">→</div>
          </div>
        )}

        {/* Stripe/Credit Card Option */}
        <div 
          className={`payment-method-card ${selectedMethod === 'stripe' ? 'selected' : ''}`}
          onClick={() => setSelectedMethod('stripe')}
        >
          <div className="method-icon">💳</div>
          <div className="method-info">
            <h3>{t('payment.creditCard', 'Credit Card')}</h3>
            <p>{t('payment.creditCardDescription', 'Visa, Mastercard, Amex')}</p>
          </div>
          <div className="method-arrow">→</div>
        </div>
      </div>

      {onCancel && (
        <button onClick={onCancel} className="btn-cancel-payment">
          {t('payment.cancel', 'Cancel')}
        </button>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
