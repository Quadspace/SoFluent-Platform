/**
 * Flex Component
 * Flexbox layout component
 * Part of global architecture - use everywhere for flex layouts
 */

import React from 'react';
import { designTokens } from '../../design-system/designTokens';

const Flex = ({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap = 'md',
  wrap = false,
  className = '',
  ...props
}) => {
  const gapMap = {
    xs: designTokens.spacing[1],
    sm: designTokens.spacing[2],
    md: designTokens.spacing[4],
    lg: designTokens.spacing[6],
    xl: designTokens.spacing[8],
    '2xl': designTokens.spacing[12],
  };

  const style = {
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap: gapMap[gap] || designTokens.spacing[4],
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  return (
    <div style={style} className={className} {...props}>
      {children}
    </div>
  );
};

export default Flex;
