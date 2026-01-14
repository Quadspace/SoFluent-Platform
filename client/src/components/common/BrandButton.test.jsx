/**
 * BrandButton Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BrandButton from './BrandButton';

describe('BrandButton', () => {
  it('renders button with children', () => {
    render(<BrandButton>Click me</BrandButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<BrandButton onClick={handleClick}>Click me</BrandButton>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<BrandButton onClick={handleClick} disabled>Click me</BrandButton>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct variant classes', () => {
    const { container: primary } = render(<BrandButton variant="primary">Button</BrandButton>);
    expect(primary.firstChild).toHaveClass('from-sofluent-cherry');

    const { container: secondary } = render(<BrandButton variant="secondary">Button</BrandButton>);
    expect(secondary.firstChild).toHaveClass('border-sofluent-cherry');
  });

  it('applies correct size classes', () => {
    const { container: small } = render(<BrandButton size="small">Button</BrandButton>);
    expect(small.firstChild).toHaveClass('px-4', 'py-2', 'text-sm');

    const { container: large } = render(<BrandButton size="large">Button</BrandButton>);
    expect(large.firstChild).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(<BrandButton fullWidth>Button</BrandButton>);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('renders LoadingButton when loading', () => {
    render(<BrandButton loading>Button</BrandButton>);
    // LoadingButton should be rendered instead
    expect(screen.getByText('Button')).toBeInTheDocument();
  });
});
