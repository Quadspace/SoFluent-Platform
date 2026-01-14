/**
 * Stack Component
 * Vertical spacing layout component
 * Part of global architecture - use everywhere for vertical layouts
 */

import React from 'react';
import { designTokens } from '../../design-system/designTokens';

const Stack = ({
  children,
  gap = 'md',
  align = 'stretch',
  className = '',
  ...props
}) => {
  const gapMap = {
    xs: designTokens.spacing[1],   // 4px
    sm: designTokens.spacing[2],   // 8px
    md: designTokens.spacing[4],   // 16px
    lg: designTokens.spacing[6],   // 24px
    xl: designTokens.spacing[8],   // 32px
    '2xl': designTokens.spacing[12], // 48px
    '3xl': designTokens.spacing[16], // 64px
  };

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  const style = {
    display: 'flex',
    flexDirection: 'column',
    gap: gapMap[gap] || designTokens.spacing[4],
    alignItems: alignMap[align] || 'stretch',
  };

  return (
    <div style={style} className={className} {...props}>
      {children}
    </div>
  );
};

export default Stack;
