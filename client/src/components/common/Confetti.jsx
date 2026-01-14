/**
 * Confetti Celebration Component
 * Top 1% Enhancement: Celebration animations for achievements
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Confetti = ({ trigger, type = 'default' }) => {
  useEffect(() => {
    if (!trigger) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const confettiTypes = {
      default: () => {
        const interval = setInterval(() => {
          if (Date.now() > end) {
            clearInterval(interval);
            return;
          }
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#E91E63', '#D4AF37', '#C2185B']
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#E91E63', '#D4AF37', '#C2185B']
          });
        }, 25);
      },
      achievement: () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E91E63', '#FFFFFF']
        });
      },
      levelUp: () => {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#E91E63', '#D4AF37', '#C2185B']
        };

        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      },
      streak: () => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6B35', '#E91E63']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF6B35', '#E91E63']
        });
      }
    };

    if (confettiTypes[type]) {
      confettiTypes[type]();
    } else {
      confettiTypes.default();
    }
  }, [trigger, type]);

  return null;
};

export default Confetti;
