/**
 * Page Loader Component
 * Full-page loading indicator
 */

import './PageLoader.css';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <div className="page-loader__container">
        <div className="page-loader__spinner">
          <div className="page-loader__spinner-ring"></div>
          <div className="page-loader__spinner-ring"></div>
          <div className="page-loader__spinner-ring"></div>
          <div className="page-loader__spinner-ring"></div>
        </div>
        <p className="page-loader__message">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
