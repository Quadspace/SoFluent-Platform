/**
 * Global Architecture Fix Script
 * Finds and reports hardcoded values that should use theme tokens
 */

/**
 * Find hardcoded hex colors in className
 */
export const findHardcodedColors = (code) => {
  const hexColorPattern = /#[0-9A-Fa-f]{3,6}/g;
  const classNameHexPattern = /className=["'][^"']*\[#[0-9A-Fa-f]{3,6}\][^"']*["']/g;
  
  const matches = code.match(classNameHexPattern) || [];
  return matches.map(match => ({
    type: 'hardcoded-color',
    value: match,
    suggestion: 'Use theme token instead (e.g., bg-sofluent-cherry)',
  }));
};

/**
 * Find hardcoded spacing values
 */
export const findHardcodedSpacing = (code) => {
  const spacingPattern = /(?:padding|margin|gap|top|bottom|left|right):\s*\d+px/g;
  const matches = code.match(spacingPattern) || [];
  return matches.map(match => ({
    type: 'hardcoded-spacing',
    value: match,
    suggestion: 'Use theme spacing token instead',
  }));
};

/**
 * Find raw button elements (should use BrandButton)
 */
export const findRawButtons = (code) => {
  const buttonPattern = /<button[^>]*>/g;
  const matches = code.match(buttonPattern) || [];
  return matches.map(match => ({
    type: 'raw-button',
    value: match,
    suggestion: 'Use BrandButton component instead',
  }));
};

/**
 * Find raw div elements that should be cards
 */
export const findRawCards = (code) => {
  // Look for divs with card-like styling
  const cardPattern = /<div[^>]*(?:className=["'][^"']*(?:card|shadow|rounded|bg-)[^"']*["'])/g;
  const matches = code.match(cardPattern) || [];
  return matches.map(match => ({
    type: 'raw-card',
    value: match,
    suggestion: 'Use BrandCard component instead',
  }));
};

/**
 * Audit file for global architecture compliance
 */
export const auditFile = (fileContent, fileName) => {
  const issues = {
    hardcodedColors: findHardcodedColors(fileContent),
    hardcodedSpacing: findHardcodedSpacing(fileContent),
    rawButtons: findRawButtons(fileContent),
    rawCards: findRawCards(fileContent),
  };

  const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);

  return {
    fileName,
    issues,
    totalIssues,
    compliant: totalIssues === 0,
  };
};
