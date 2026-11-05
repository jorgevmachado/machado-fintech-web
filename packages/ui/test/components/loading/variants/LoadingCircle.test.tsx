import { render, screen } from '@testing-library/react';

import LoadingCircle from '../../../../src/components/loading/variants/circle/LoadingCircle';

describe('LoadingCircle', () => {
  describe('default', () => {
    it('should render with default size and tone', () => {
      render(<LoadingCircle />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveClass('inline-block');
      expect(loading).toHaveClass('rounded-full');
      expect(loading).toHaveClass('border-current');
      expect(loading).toHaveClass('border-t-transparent');
      expect(loading).toHaveClass('animate-spin');
      expect(loading).toHaveClass('text-blue-600');
    });
  });

  describe('size', () => {
    it('should apply the provided size', () => {
      render(<LoadingCircle size="lg" />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveClass('size-10');
      expect(loading).toHaveClass('border-4');
    });
  });

  describe('tone', () => {
    it('should apply the provided tone', () => {
      render(<LoadingCircle tone="warning" />);

      expect(screen.getByRole('status'))
      .toHaveClass('text-amber-600');
    });
  });

  describe('accessibility', () => {
    it('should render as a status element with loading label', () => {
      render(<LoadingCircle />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveAttribute(
        'aria-label',
        'Carregando',
      );
    });
  });
});