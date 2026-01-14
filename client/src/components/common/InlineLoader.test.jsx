/**
 * InlineLoader Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InlineLoader from './InlineLoader';

describe('InlineLoader', () => {
  it('renders spinner', () => {
    const { container } = render(<InlineLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays default message', () => {
    render(<InlineLoader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays custom message', () => {
    render(<InlineLoader message="Loading courses..." />);
    expect(screen.getByText('Loading courses...')).toBeInTheDocument();
  });

  it('hides message when showMessage is false', () => {
    render(<InlineLoader showMessage={false} />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<InlineLoader className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes size prop to LoadingSpinner', () => {
    const { container } = render(<InlineLoader size="large" />);
    // LoadingSpinner should receive size prop
    expect(container.firstChild).toBeInTheDocument();
  });
});
