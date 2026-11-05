import { render, screen } from '@testing-library/react';

import Loading from '../../../src/components/loading/Loading';

describe('Loading', () => {
  describe('default', () => {
    it('should render the circle variant with default props', () => {
      render(<Loading />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveClass('inline-block');
      expect(loading).toHaveClass('rounded-full');
      expect(loading).toHaveClass('border-current');
      expect(loading).toHaveClass('animate-spin');
      expect(loading).toHaveClass('text-blue-600');
    });
  });

  describe('variant', () => {
    it('should render the bar variant', () => {
      render(<Loading variant="bar" />);

      const loading = screen.getByRole('status');
      const indicator = loading.firstElementChild;

      expect(loading).toHaveClass('h-1');
      expect(indicator).toHaveClass('animate-loading-bar');
    });

    it('should render the circle variant', () => {
      render(<Loading variant="circle" />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveClass('rounded-full');
      expect(loading).toHaveClass('animate-spin');
    });

    it('should render the dot variant', () => {
      render(<Loading variant="dot" />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1',
      );

      expect(loading.children).toHaveLength(3);
    });
  });

  describe('size', () => {
    it('should pass the size to the selected variant', () => {
      render(
        <Loading
          variant="circle"
          size="lg"
        />,
      );

      expect(screen.getByRole('status')).toHaveClass('size-10');
    });
  });

  describe('tone', () => {
    it('should pass the tone to the selected variant', () => {
      render(
        <Loading
          variant="circle"
          tone="warning"
        />,
      );

      expect(screen.getByRole('status'))
      .toHaveClass('text-amber-600');
    });
  });

  describe('bar props', () => {
    it('should pass progress to the bar variant', () => {
      render(
        <Loading
          variant="bar"
          progress
        />,
      );

      const indicator = screen
      .getByRole('status')
        .firstElementChild;

      expect(indicator)
      .toHaveClass('animate-loading-progress');
    });

    it('should pass complete to the bar variant', () => {
      render(
        <Loading
          variant="bar"
          complete
        />,
      );

      const indicator = screen
      .getByRole('status')
        .firstElementChild;

      expect(indicator).toHaveClass('w-full');
      expect(indicator).toHaveClass('transition-[width]');
      expect(indicator).toHaveClass('duration-500');
    });

    it('should pass progress and complete to the bar variant', () => {
      render(
        <Loading
          variant="bar"
          progress
          complete
        />,
      );

      const indicator = screen
      .getByRole('status')
        .firstElementChild;

      expect(indicator).toHaveClass('w-full');
      expect(indicator).not.toHaveClass(
        'animate-loading-progress',
      );
    });
  });

  describe('non-bar variants', () => {
    it('should not apply bar props to the circle variant', () => {
      render(
        <Loading
          variant="circle"
          complete
          progress
        />,
      );

      const loading = screen.getByRole('status');

      expect(loading).toHaveClass('animate-spin');
      expect(loading).not.toHaveClass('w-full');
      expect(loading).not.toHaveClass(
        'animate-loading-progress',
      );
    });

    it('should not apply bar props to the dot variant', () => {
      render(
        <Loading
          variant="dot"
          complete
          progress
        />,
      );

      const loading = screen.getByRole('status');

      expect(loading.children).toHaveLength(3);
    });
  });

  describe('accessibility', () => {
    it('should render a loading status', () => {
      render(<Loading />);

      const loading = screen.getByRole('status');

      expect(loading).toHaveAttribute(
        'aria-label',
        'Carregando',
      );
    });
  });
});