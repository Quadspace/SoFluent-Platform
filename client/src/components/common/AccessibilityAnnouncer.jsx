/**
 * Accessibility Announcer Component
 * Announces dynamic content changes to screen readers
 */

import { useEffect } from 'react';
import { ariaUtils } from '../../utils/accessibility';

const AccessibilityAnnouncer = ({ message, priority = 'polite' }) => {
  useEffect(() => {
    if (message) {
      ariaUtils.announce(message, priority);
    }
  }, [message, priority]);

  return null;
};

export default AccessibilityAnnouncer;
