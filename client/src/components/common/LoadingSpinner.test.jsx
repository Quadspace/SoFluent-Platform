/**
 * LoadingSpinner Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container: small } = render(<LoadingSpinner size="small" />);
    expect(small.firstChild).toHaveClass('w-4', 'h-4');

    const { container: large } = render(<LoadingSpinner size="large" />);
    expect(large.firstChild).toHaveClass('w-12', 'h-12');
  });

  it('applies correct color classes', () => {
    const { container: primary } = render(<LoadingSpinner color="primary" />);
    expect(primary.firstChild).toHaveClass('border-[#E91E63]');

    const { container: secondary } = render(<LoadingSpinner color="secondary" />);
    expect(secondary.firstChild).toHaveClass('border-[#D4AF37]');
  });

  it('renders full-screen when fullScreen prop is true', () => {
    const { container } = render(<LoadingSpinner fullScreen={true} />);
    expect(container.firstChild).toHaveClass('fixed', 'inset-0');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
