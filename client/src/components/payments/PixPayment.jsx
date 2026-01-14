/**
 * Pix Payment Component
 * Displays Pix QR code and payment instructions for Brazilian users
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useUserSafe } from '../../hooks/useClerkSafe.jsx';
import './PixPayment.css';

const PixPayment = ({ courseId, amount, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { getToken } = useUserSafe();
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Create Pix payment on mount
  useEffect(() => {
    createPayment();
  }, []);

  // Poll payment status every 5 seconds
  useEffect(() => {
    if (payment?.id && (payment.status === 'pending' || payment.status === 'requires_payment_method' || payment.status === 'processing')) {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [payment?.id, payment?.status]);

  const createPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const response = await axios.post(
        '/api/payments/pix/create',
        { courseId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPayment(response.data.payment);
      } else {
        setError(response.data.message || 'Failed to create payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create Pix payment');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!payment?.id || checkingStatus) return;

    try {
      setCheckingStatus(true);
      const token = await getToken();
      const response = await axios.get(
        `/api/payments/pix/status/${payment.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newStatus = response.data.status;
        setPayment(prev => ({ ...prev, status: newStatus }));
        
        // Handle completed payment
        if (newStatus === 'completed' || newStatus === 'succeeded') {
          if (onSuccess) {
            setTimeout(() => onSuccess(response.data.purchase), 1000);
          }
        }
      }
    } catch (err) {
      // Payment status check failed - will retry on next poll
    } finally {
      setCheckingStatus(false);
    }
  };

  const copyPixCode = () => {
    const pixCode = payment?.copyPaste || payment?.qrCode;
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      // Show toast notification
      alert(t('pixPayment.copied', 'Pix code copied to clipboard!'));
    }
  };

  const formatAmount = (cents) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="pix-payment-container">
        <div className="pix-loading">
          <div className="spinner" />
          <p>{t('pixPayment.creating', 'Creating Pix payment...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pix-payment-container">
        <div className="pix-error">
          <div className="error-icon">⚠️</div>
          <h3>{t('pixPayment.error', 'Payment Error')}</h3>
          <p>{error}</p>
          <button onClick={createPayment} className="btn-retry">
            {t('pixPayment.retry', 'Try Again')}
          </button>
          {onCancel && (
            <button onClick={onCancel} className="btn-cancel">
              {t('pixPayment.cancel', 'Cancel')}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <div className="pix-payment-container">
      <div className="pix-payment-content">
        {/* Header */}
        <div className="pix-header">
          <h2>{t('pixPayment.title', 'Pay with Pix')}</h2>
          <p className="pix-amount">{formatAmount(payment.amount)}</p>
        </div>

        {/* Instructions */}
        <div className="pix-instructions">
          <p>{t('pixPayment.instructions', 'Scan the QR code below with your banking app to complete the payment.')}</p>
          <p className="pix-note">
            {t('pixPayment.note', 'Payment is instant and automatic. You will be enrolled immediately after payment.')}
          </p>
        </div>

        {/* QR Code */}
        {payment.qrCodeBase64 && (
          <div className="pix-qr-container">
            <img 
              src={
                payment.qrCodeBase64.startsWith('http') 
                  ? payment.qrCodeBase64 
                  : `data:image/png;base64,${payment.qrCodeBase64}`
              }
              alt="Pix QR Code"
              className="pix-qr-code"
              onError={(e) => {
                // Fallback: try using qrCode if base64 fails
                if (payment.qrCode && !payment.qrCode.startsWith('http')) {
                  e.target.src = `data:image/png;base64,${payment.qrCode}`;
                }
              }}
            />
          </div>
        )}

        {/* Copy Paste Code */}
        {(payment.copyPaste || payment.qrCode) && (
          <div className="pix-copy-paste">
            <label>{t('pixPayment.copyPaste', 'Or copy the Pix code:')}</label>
            <div className="pix-code-container">
              <code className="pix-code">{payment.copyPaste || payment.qrCode}</code>
              <button onClick={copyPixCode} className="btn-copy">
                {t('pixPayment.copy', 'Copy')}
              </button>
            </div>
          </div>
        )}

        {/* Status */}
        {(payment.status === 'pending' || payment.status === 'requires_payment_method' || payment.status === 'processing') && (
          <div className="pix-status pending">
            <div className="status-indicator" />
            <p>{t('pixPayment.waiting', 'Waiting for payment...')}</p>
            {checkingStatus && (
              <p className="status-checking">{t('pixPayment.checking', 'Checking status...')}</p>
            )}
          </div>
        )}

        {(payment.status === 'completed' || payment.status === 'succeeded') && (
          <div className="pix-status completed">
            <div className="status-icon">✅</div>
            <p>{t('pixPayment.completed', 'Payment confirmed! Redirecting...')}</p>
          </div>
        )}

        {/* Expiry */}
        {(payment.expiresAt || payment.dueDate) && (
          <p className="pix-expiry">
            {t('pixPayment.expires', 'Valid until')}: {new Date(payment.expiresAt || payment.dueDate).toLocaleDateString('pt-BR')}
          </p>
        )}

        {/* Cancel Button */}
        {onCancel && (payment.status === 'pending' || payment.status === 'requires_payment_method') && (
          <button onClick={onCancel} className="btn-cancel-payment">
            {t('pixPayment.cancel', 'Cancel Payment')}
          </button>
        )}
      </div>
    </div>
  );
};

export default PixPayment;
