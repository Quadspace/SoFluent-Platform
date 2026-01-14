/**
 * BrandCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BrandCard from './BrandCard';

describe('BrandCard', () => {
  it('renders children', () => {
    render(<BrandCard>Card Content</BrandCard>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<BrandCard>Content</BrandCard>);
    expect(container.firstChild).toHaveClass('bg-white');
  });

  it('applies dark variant classes', () => {
    const { container } = render(<BrandCard variant="dark">Content</BrandCard>);
    expect(container.firstChild).toHaveClass('bg-sofluent-dark');
  });

  it('applies gradient variant classes', () => {
    const { container } = render(<BrandCard variant="gradient">Content</BrandCard>);
    expect(container.firstChild).toHaveClass('bg-gradient-to-br');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<BrandCard onClick={handleClick}>Clickable Card</BrandCard>);
    
    await userEvent.click(screen.getByText('Clickable Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover classes when hover is true', () => {
    const { container } = render(<BrandCard hover={true}>Content</BrandCard>);
    expect(container.firstChild).toHaveClass('hover:shadow-xl');
  });

  it('does not apply hover classes when hover is false', () => {
    const { container } = render(<BrandCard hover={false}>Content</BrandCard>);
    expect(container.firstChild).not.toHaveClass('hover:shadow-xl');
  });

  it('applies custom className', () => {
    const { container } = render(<BrandCard className="custom-class">Content</BrandCard>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
