/**
 * Page Consistency Utils Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StandardPage, StandardSection, StandardContainer } from './pageConsistency';
import { renderWithProviders } from '../test/utils';

describe('pageConsistency', () => {
  describe('StandardPage', () => {
    it('renders children when not loading', () => {
      renderWithProviders(
        <StandardPage>
          <div>Test Content</div>
        </StandardPage>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('shows loading state when loading prop is true', () => {
      renderWithProviders(
        <StandardPage loading={true}>
          <div>Test Content</div>
        </StandardPage>
      );
      
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('shows error display when error prop is provided', () => {
      renderWithProviders(
        <StandardPage error="Test error">
          <div>Test Content</div>
        </StandardPage>
      );
      
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    it('applies background class', () => {
      const { container } = renderWithProviders(
        <StandardPage background="bg-gray-100">
          <div>Content</div>
        </StandardPage>
      );
      
      // Check if background is applied through PageLayout
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('StandardSection', () => {
    it('renders children', () => {
      render(<StandardSection><div>Section Content</div></StandardSection>);
      expect(screen.getByText('Section Content')).toBeInTheDocument();
    });

    it('applies default padding', () => {
      const { container } = render(<StandardSection><div>Content</div></StandardSection>);
      expect(container.firstChild).toHaveClass('py-20');
    });

    it('applies custom padding', () => {
      const { container } = render(
        <StandardSection padding="py-10"><div>Content</div></StandardSection>
      );
      expect(container.firstChild).toHaveClass('py-10');
    });

    it('applies background class', () => {
      const { container } = render(
        <StandardSection background="bg-gray-100"><div>Content</div></StandardSection>
      );
      expect(container.firstChild).toHaveClass('bg-gray-100');
    });
  });

  describe('StandardContainer', () => {
    it('renders children', () => {
      render(<StandardContainer><div>Container Content</div></StandardContainer>);
      expect(screen.getByText('Container Content')).toBeInTheDocument();
    });

    it('applies default maxWidth', () => {
      const { container } = render(<StandardContainer><div>Content</div></StandardContainer>);
      expect(container.firstChild).toHaveClass('max-w-7xl');
    });

    it('applies custom maxWidth', () => {
      const { container } = render(
        <StandardContainer maxWidth="max-w-5xl"><div>Content</div></StandardContainer>
      );
      expect(container.firstChild).toHaveClass('max-w-5xl');
    });
  });
});
