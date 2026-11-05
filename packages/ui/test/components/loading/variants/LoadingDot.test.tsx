import { render, screen } from '@testing-library/react';

import LoadingDot from '../../../../src/components/loading/variants/dot/LoadingDot';

describe('LoadingDot', () => {
  describe('default', () => {
    it('should render with default size and tone', () => {
      render(<LoadingDot />);

      const loading = screen.getByRole('status');
      const dots = loading.children;

      expect(loading).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1',
      );

      expect(dots).toHaveLength(3);

      Array.from(dots).forEach((dot) => {
        expect(dot).toHaveClass('text-blue-600');
      });
    });
  });

  describe('size', () => {
    it('should apply the provided size to all dots', () => {
      render(<LoadingDot size="lg" />);

      const dots = screen.getByRole('status').children;

      Array.from(dots).forEach((dot) => {
        expect(dot).toHaveClass('size-3');
      });
    });
  });

  describe('tone', () => {
    it('should apply the provided tone to all dots', () => {
      render(<LoadingDot tone="warning" />);

      const dots = screen.getByRole('status').children;

      Array.from(dots).forEach((dot) => {
        expect(dot).toHaveClass('text-amber-600');
      });
    });
  });

  describe('animation delay', () => {
    it('should apply the expected delay to each dot', () => {
      render(<LoadingDot />);

      const dots = screen.getByRole('status').children;

      expect(dots[0]).not.toHaveClass(
        '[animation-delay:150ms]',
      );

      expect(dots[0]).not.toHaveClass(
        '[animation-delay:300ms]',
      );

      expect(dots[1]).toHaveClass(
        '[animation-delay:150ms]',
      );

      expect(dots[2]).toHaveClass(
        '[animation-delay:300ms]',
      );
    });
  });

  describe('accessibility', () => {
    it('should render as a status element with loading label', () => {
      render(<LoadingDot />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveAttribute(
        'aria-label',
        'Carregando',
      );
    });
  });
});