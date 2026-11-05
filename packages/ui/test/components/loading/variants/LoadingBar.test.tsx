import { render, screen } from '@testing-library/react';

import LoadingBar from '../../../../src/components/loading/variants/bar/LoadingBar';

describe('LoadingBar', () => {
  describe('default', () => {
    it('should render with default size and tone', () => {
      render(<LoadingBar />);

      const loading = screen.getByRole('status');
      const indicator = loading.firstElementChild;

      expect(loading).toHaveClass('h-1');
      expect(indicator).toHaveClass('text-blue-600');
      expect(indicator).toHaveClass('animate-loading-bar');
    });
  });

  describe('size', () => {
    it('should apply the provided size', () => {
      render(<LoadingBar size="lg" />);

      expect(screen.getByRole('status')).toHaveClass('h-2');
    });
  });

  describe('tone', () => {
    it('should apply the provided tone', () => {
      render(<LoadingBar tone="warning" />);

      expect(screen.getByRole('status').firstElementChild)
      .toHaveClass('text-amber-600');
    });
  });

  describe('progress', () => {
    it('should use the progress animation when enabled', () => {
      render(<LoadingBar progress />);

      const indicator = screen.getByRole('status').firstElementChild;

      expect(indicator).toHaveClass('animate-loading-progress');
      expect(indicator).not.toHaveClass('animate-loading-bar');
    });

    it('should use the indeterminate animation when disabled', () => {
      render(<LoadingBar progress={false} />);

      const indicator = screen.getByRole('status').firstElementChild;

      expect(indicator).toHaveClass('animate-loading-bar');
      expect(indicator).not.toHaveClass('animate-loading-progress');
    });
  });

  describe('complete', () => {
    it('should fill the entire bar', () => {
      render(<LoadingBar complete />);

      const indicator = screen.getByRole('status').firstElementChild;

      expect(indicator).toHaveClass('w-full');
      expect(indicator).toHaveClass('transition-[width]');
      expect(indicator).toHaveClass('duration-500');
      expect(indicator).toHaveClass('ease-out');
    });

    it('should remove loading animations when complete', () => {
      render(<LoadingBar complete />);

      const indicator = screen.getByRole('status').firstElementChild;

      expect(indicator).not.toHaveClass('animate-loading-bar');
      expect(indicator).not.toHaveClass('animate-loading-progress');
    });
  });

  describe('progress and complete', () => {
    it('should prioritize complete over progress', () => {
      render(
        <LoadingBar
          progress
          complete
        />,
      );

      const indicator = screen.getByRole('status').firstElementChild;

      expect(indicator).toHaveClass('w-full');
      expect(indicator).not.toHaveClass('animate-loading-progress');
      expect(indicator).not.toHaveClass('animate-loading-bar');
    });
  });

  describe('accessibility', () => {
    it('should render as a status element with loading label', () => {
      render(<LoadingBar />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveAttribute(
        'aria-label',
        'Carregando',
      );
    });
  });
});