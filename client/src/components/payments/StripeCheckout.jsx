/**
 * Stripe Checkout Component
 * Handles credit card payments via Stripe
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import './StripeCheckout.css';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckoutForm = ({ courseId, amount, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { getToken } = useUserSafe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      
      // Create payment intent
      const response = await axios.post(
        '/api/payments/stripe/create-intent',
        { courseId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create payment');
      }

      const { clientSecret } = response.data;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        if (onSuccess) {
          onSuccess({ paymentIntentId: paymentIntent.id });
        }
      }
    } catch (err) {
      console.error('Stripe payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="stripe-checkout-container">
      <div className="stripe-checkout-content">
        <h2>{t('stripeCheckout.title', 'Pay with Credit Card')}</h2>
        <p className="stripe-amount">{formatAmount(amount)}</p>

        <form onSubmit={handleSubmit} className="stripe-form">
          <div className="stripe-card-element">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#fa755a',
                  },
                },
              }}
            />
          </div>

          {error && (
            <div className="stripe-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="stripe-submit-btn"
          >
            {loading
              ? t('stripeCheckout.processing', 'Processing...')
              : t('stripeCheckout.pay', `Pay ${formatAmount(amount)}`)
            }
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="stripe-cancel-btn"
            >
              {t('stripeCheckout.cancel', 'Cancel')}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

const StripeCheckout = ({ courseId, amount, onSuccess, onCancel }) => {
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="stripe-error">
        Stripe is not configured. Please contact support.
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm
        courseId={courseId}
        amount={amount}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripeCheckout;
