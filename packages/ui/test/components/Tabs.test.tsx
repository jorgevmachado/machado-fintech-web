import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Tabs } from '../../src';

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolveChildren: (child?: React.ReactNode) => child,
  }),
}));

type THarnessProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  activationMode?: 'automatic' | 'manual';
  forceMount?: boolean;
};

const ITEMS = [
  { value: 'overview', label: 'Overview', content: 'Overview panel' },
  { value: 'details', label: 'Details', content: 'Details panel' },
  { value: 'history', label: 'History', content: 'History panel', disabled: true },
];

function Harness({ defaultValue, value, onValueChange, activationMode, forceMount }: THarnessProps) {
  return (
    <Tabs
      ariaLabel="Sections"
      items={ITEMS}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      activationMode={activationMode}
      forceMount={forceMount}
    />
  );
}

describe('Tabs', () => {
  describe('rendering', () => {
    it('should render a named tablist with its tabs', () => {
      render(<Harness defaultValue="overview" />);

      expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('should show only the active panel', () => {
      render(<Harness defaultValue="overview" />);

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
      expect(screen.queryByText('Details panel')).not.toBeInTheDocument();
    });

    it('should link each trigger to its panel through aria-controls', () => {
      render(<Harness defaultValue="overview" />);

      const trigger = screen.getByRole('tab', { name: 'Overview' });
      const panel = screen.getByRole('tabpanel');

      expect(trigger).toHaveAttribute('aria-controls', panel.id);
      expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('should not point aria-controls at a panel that is not mounted', () => {
      render(<Harness defaultValue="overview" />);

      expect(screen.getByRole('tab', { name: 'Details' })).not.toHaveAttribute('aria-controls');
    });

    it('should render nothing when the items list is empty', () => {
      const { container } = render(<Tabs items={[]} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('selection', () => {
    it('should mark the default tab as selected and the others not', () => {
      render(<Harness defaultValue="overview" />);

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'false');
    });

    it('should switch the panel on click', () => {
      render(<Harness defaultValue="overview" />);

      fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

      expect(screen.getByRole('tabpanel')).toHaveTextContent('Details panel');
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    });

    it('should keep the selection when controlled and only report the intent', () => {
      const onValueChange = jest.fn();
      render(<Harness value="overview" onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('tab', { name: 'Details' }));

      expect(onValueChange).toHaveBeenCalledWith('details');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    });

    it('should not select a disabled tab', () => {
      const onValueChange = jest.fn();
      render(<Harness defaultValue="overview" onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('tab', { name: 'History' }));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    });

    it('should fall back to the first enabled tab when the default does not match any item', () => {
      render(<Harness defaultValue="does-not-exist" />);

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    });

    it('should fall back to the first enabled item when no default is given', () => {
      render(
        <Tabs
          ariaLabel="Sections"
          items={[
            { value: 'locked', label: 'Locked', content: 'Locked body', disabled: true },
            { value: 'first', label: 'First', content: 'First body' },
            { value: 'second', label: 'Second', content: 'Second body' },
          ]}
        />,
      );

      expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('First body');
    });
  });

  describe('roving tabindex', () => {
    it('should leave the active tab reachable by Tab and the others out', () => {
      render(<Harness defaultValue="overview" />);

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('tabindex', '-1');
    });

    it('should not render any tabindex when every tab is disabled', () => {
      render(
        <Tabs
          items={[
            { value: 'a', label: 'A', content: 'A body', disabled: true },
            { value: 'b', label: 'B', content: 'B body', disabled: true },
          ]}
        />,
      );

      screen.getAllByRole('tab').forEach((tab) => {
        expect(tab).not.toHaveAttribute('tabindex');
      });
    });
  });

  describe('keyboard', () => {
    it('should move focus and selection with ArrowRight, wrapping around', () => {
      render(<Harness defaultValue="overview" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Details panel');
    });

    it('should skip disabled tabs when moving', () => {
      render(<Harness defaultValue="details" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    });

    it('should jump to the first and last enabled tab with Home and End', () => {
      render(<Harness defaultValue="details" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Home' });
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'End' });
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
    });

    it('should only move focus in manual activation mode', () => {
      render(<Harness defaultValue="overview" activationMode="manual" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    });

    it('should walk backwards with ArrowLeft, wrapping from the first tab', () => {
      render(<Harness defaultValue="overview" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowLeft' });

      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Details panel');
    });

    it('should accept ArrowDown and ArrowUp as horizontal moves', () => {
      render(<Harness defaultValue="overview" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowDown' });
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowUp' });
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    });

    it('should ignore keys it does not handle', () => {
      render(<Harness defaultValue="overview" />);

      fireEvent.keyDown(screen.getByRole('tablist'), { key: 'a' });

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('forceMount', () => {
    it('should keep inactive panels mounted but hidden', () => {
      render(<Harness defaultValue="overview" forceMount />);

      const detailsPanel = screen.getByText('Details panel').closest('[role="tabpanel"]');

      expect(detailsPanel).toBeInTheDocument();
      expect(detailsPanel).toHaveClass('hidden');
    });

    it('should keep aria-controls valid for a mounted inactive panel', () => {
      render(<Harness defaultValue="overview" forceMount />);

      const detailsTab = screen.getByRole('tab', { name: 'Details' });
      const panelId = detailsTab.getAttribute('aria-controls');

      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId ?? '')).toHaveAttribute('role', 'tabpanel');
    });

    it('should keep an inactive mounted panel out of the focus tree', () => {
      render(<Harness defaultValue="overview" forceMount />);

      const detailsPanel = screen.getByText('Details panel').closest('[role="tabpanel"]');

      expect(detailsPanel).toHaveAttribute('inert');
      expect(detailsPanel).toHaveAttribute('tabindex', '-1');
    });

    it('should keep the active panel reachable by Tab', () => {
      render(<Harness defaultValue="overview" forceMount />);

      const activePanel = screen.getByText('Overview panel').closest('[role="tabpanel"]');

      expect(activePanel).toHaveAttribute('tabindex', '0');
      expect(activePanel).not.toHaveAttribute('inert');
    });
  });
});