/**
 * ErrorDisplay Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import ErrorDisplay from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders error message', () => {
    renderWithProviders(
      <ErrorDisplay error="Test error message" />
    );
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders network error message', () => {
    renderWithProviders(
      <ErrorDisplay error={{ type: 'network' }} />
    );
    
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it('renders retry button when onRetry provided', () => {
    const handleRetry = vi.fn();
    renderWithProviders(
      <ErrorDisplay error="Error" onRetry={handleRetry} />
    );
    
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });

  it('calls onRetry when retry button clicked', () => {
    const handleRetry = vi.fn();
    renderWithProviders(
      <ErrorDisplay error="Error" onRetry={handleRetry} />
    );
    
    screen.getByText(/retry/i).click();
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders dismiss button when onDismiss provided', () => {
    const handleDismiss = vi.fn();
    renderWithProviders(
      <ErrorDisplay error="Error" onDismiss={handleDismiss} />
    );
    
    const dismissButton = screen.getByLabelText(/dismiss/i);
    expect(dismissButton).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { container } = renderWithProviders(
      <ErrorDisplay error="Error" variant="inline" />
    );
    
    expect(container.firstChild).toHaveClass('bg-yellow-50');
  });

  it('does not render when error is null', () => {
    const { container } = renderWithProviders(
      <ErrorDisplay error={null} />
    );
    
    expect(container.firstChild).toBeNull();
  });
});
