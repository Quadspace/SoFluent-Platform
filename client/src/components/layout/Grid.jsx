/**
 * Grid Component
 * Responsive grid layout component
 * Part of global architecture - use everywhere for grid layouts
 */

import React from 'react';
import { designTokens } from '../../design-system/designTokens';

const Grid = ({
  children,
  columns = 1,
  gap = 'lg',
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
  };

  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gapMap[gap] || designTokens.spacing[6],
  };

  // Responsive breakpoints
  const responsiveStyle = {
    ...style,
    '@media (max-width: 640px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
    '@media (min-width: 641px) and (max-width: 1024px)': {
      gridTemplateColumns: `repeat(${Math.min(columns, 2)}, 1fr)`,
    },
  };

  // Use Tailwind classes for responsive behavior
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const responsiveClasses = `
    grid
    ${columnClasses[columns] || 'grid-cols-1'}
    ${gapClasses[gap] || 'gap-6'}
  `;

  return (
    <div className={`${responsiveClasses.trim()} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

export default Grid;
