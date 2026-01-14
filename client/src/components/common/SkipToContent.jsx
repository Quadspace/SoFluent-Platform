/**
 * Skip to Content Link
 * Accessibility: Allows keyboard users to skip navigation
 */

import './SkipToContent.css';

const SkipToContent = ({ targetId = 'main-content' }) => {
  return (
    <a href={`#${targetId}`} className="skip-to-content">
      Skip to main content
    </a>
  );
};

export default SkipToContent;
