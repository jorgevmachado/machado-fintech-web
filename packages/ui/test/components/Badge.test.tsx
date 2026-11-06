import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { buildBadgeTheme } from '@fintech/theme';

import Badge from '../../src/components/badge';

const mockResolveChildren = jest.fn((children: React.ReactNode) => children);

jest.mock('@fintech/theme', () => ({
  buildBadgeTheme: jest.fn(() => 'badge-theme'),
}));

jest.mock('../../src/lang/resolver', () => ({
  useTranslationResolver: () => ({ resolveChildren: mockResolveChildren }),
}));

describe('Badge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockResolveChildren.mockImplementation((children: React.ReactNode) => children);
  });

  it('renders a span using the default theme without icon wrappers', () => {
    render(<Badge>Active</Badge>);

    const badge = screen.getByText('Active');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('badge-theme');
    expect(badge.children).toHaveLength(0);
    expect(buildBadgeTheme).toHaveBeenCalledWith({
      tone: 'primary',
      random: false,
      size: 'md',
      variant: 'soft',
      shape: 'pill',
      className: undefined,
    });
  });

  it('passes custom visual options and class names to the theme builder', () => {
    render(
      <Badge tone="danger" random size="lg" variant="outline" shape="rounded" className="custom-badge">
        Failed
      </Badge>,
    );

    expect(buildBadgeTheme).toHaveBeenCalledWith({
      tone: 'danger',
      random: true,
      size: 'lg',
      variant: 'outline',
      shape: 'rounded',
      className: 'custom-badge',
    });
    const badge = screen.getByText('Failed');
    expect(badge).not.toHaveAttribute('tone');
    expect(badge).not.toHaveAttribute('random');
    expect(badge).not.toHaveAttribute('variant');
    expect(badge).not.toHaveAttribute('shape');
  });

  it('renders translated children using the shared resolver with depth three', () => {
    const children = <strong>badge.active</strong>;
    mockResolveChildren.mockReturnValue(<strong>Ativo</strong>);

    render(<Badge>{children}</Badge>);

    expect(mockResolveChildren).toHaveBeenCalledWith(children, 3);
    expect(screen.getByText('Ativo').tagName).toBe('STRONG');
    expect(screen.queryByText('badge.active')).not.toBeInTheDocument();
  });

  it('places decorative icons before and after the content and hides them from assistive technology', () => {
    render(
      <Badge
        iconLeft={<svg data-testid="left-icon" />}
        iconRight={<svg data-testid="right-icon" />}
      >
        Active
      </Badge>,
    );

    const badge = screen.getByText('Active');
    const leftWrapper = screen.getByTestId('left-icon').parentElement;
    const rightWrapper = screen.getByTestId('right-icon').parentElement;
    expect(badge.firstElementChild).toBe(leftWrapper);
    expect(badge.lastElementChild).toBe(rightWrapper);
    for (const wrapper of [leftWrapper, rightWrapper]) {
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper).toHaveClass('inline-flex', 'shrink-0');
    }
  });

  it('forwards native span attributes, styles and event handlers', () => {
    const onClick = jest.fn();
    render(
      <Badge
        id="account-status"
        role="status"
        aria-label="Account status"
        data-state="active"
        title="Active account"
        style={{ marginTop: 4 }}
        onClick={onClick}
      >
        Active
      </Badge>,
    );

    const badge = screen.getByRole('status', { name: 'Account status' });
    expect(badge).toHaveAttribute('id', 'account-status');
    expect(badge).toHaveAttribute('data-state', 'active');
    expect(badge).toHaveAttribute('title', 'Active account');
    expect(badge).toHaveStyle({ marginTop: '4px' });
    fireEvent.click(badge);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
