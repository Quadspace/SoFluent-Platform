/**
 * BrandText Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BrandText from './BrandText';

describe('BrandText', () => {
  it('renders children', () => {
    const { getByText } = render(<BrandText>Test Text</BrandText>);
    expect(getByText('Test Text')).toBeInTheDocument();
  });

  it('renders as paragraph by default', () => {
    const { container } = render(<BrandText>Text</BrandText>);
    expect(container.firstChild.tagName).toBe('P');
  });

  it('renders as custom element when as prop provided', () => {
    const { container } = render(<BrandText as="h1">Heading</BrandText>);
    expect(container.firstChild.tagName).toBe('H1');
  });

  it('applies display variant classes', () => {
    const { container } = render(<BrandText variant="display">Text</BrandText>);
    expect(container.firstChild).toHaveClass('font-display');
  });

  it('applies body variant classes', () => {
    const { container } = render(<BrandText variant="body">Text</BrandText>);
    expect(container.firstChild).toHaveClass('font-body');
  });

  it('applies correct size classes', () => {
    const { container: small } = render(<BrandText size="sm">Text</BrandText>);
    expect(small.firstChild).toHaveClass('text-sm');

    const { container: large } = render(<BrandText size="xl">Text</BrandText>);
    expect(large.firstChild).toHaveClass('text-xl');
  });

  it('applies correct color classes', () => {
    const { container: primary } = render(<BrandText color="primary">Text</BrandText>);
    expect(primary.firstChild).toHaveClass('text-sofluent-black');

    const { container: cherry } = render(<BrandText color="cherry">Text</BrandText>);
    expect(cherry.firstChild).toHaveClass('text-sofluent-cherry');
  });

  it('applies correct weight classes', () => {
    const { container: bold } = render(<BrandText weight="bold">Text</BrandText>);
    expect(bold.firstChild).toHaveClass('font-bold');

    const { container: semibold } = render(<BrandText weight="semibold">Text</BrandText>);
    expect(semibold.firstChild).toHaveClass('font-semibold');
  });

  it('applies custom className', () => {
    const { container } = render(<BrandText className="custom-class">Text</BrandText>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
