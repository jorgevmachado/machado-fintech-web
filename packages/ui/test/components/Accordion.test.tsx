import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Accordion } from '../../src';

jest.mock('../../src/lang', () => ({
  useTranslationResolver: () => ({
    resolveChildren: (child?: React.ReactNode) => child,
  }),
}));

jest.mock('../../src/primitives', () => ({
  // O `Icon` real aceita `TIcon` (string) ou `ReactNode`; o mock preserva as
  // duas formas para o teste conseguir distinguir ícone padrão de customizado.
  Icon: ({ icon, ...props }: { icon?: React.ReactNode }) => (
    typeof icon === 'string'
      ? <span data-testid={`icon-${icon}`} {...props} />
      : <span data-testid="icon-node" {...props}>{icon}</span>
  ),
}));

type TAccordionHarnessProps = {
  mode?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | null | Array<string>;
  value?: string | null | Array<string>;
  onValueChange?: (value: string | null | Array<string>) => void;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: React.ReactNode;
  forceMount?: boolean;
};

function Harness({
  mode,
  collapsible,
  defaultValue,
  value,
  onValueChange,
  headingLevel,
  icon,
  forceMount,
}: TAccordionHarnessProps) {
  const shared = {
    mode,
    collapsible,
    headingLevel,
    icon,
    onValueChange,
    defaultValue,
    value,
    forceMount,
    items: [
      { value: 'shipping', title: 'Shipping', content: 'Shipping body' },
      { value: 'billing', title: 'Billing', content: 'Billing body', icon: <span data-testid="item-icon" /> },
    ],
  } as React.ComponentProps<typeof Accordion>;

  return <Accordion {...shared} />;
}

describe('Accordion', () => {
  describe('rendering', () => {
    it('should wrap every trigger in a heading of the requested level', () => {
      render(<Harness defaultValue="shipping" />);

      const heading = screen.getByRole('heading', { level: 3, name: 'Shipping' });

      expect(heading.querySelector('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('should honour a custom heading level', () => {
      render(<Harness headingLevel={2} />);

      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    });

    it('should start closed when no defaultValue is given', () => {
      render(<Harness />);

      screen.getAllByRole('button').forEach((trigger) => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('should link the trigger and the region through ids', () => {
      render(<Harness defaultValue="shipping" />);

      const trigger = screen.getByRole('button', { name: 'Shipping' });
      const region = screen.getByRole('region');

      expect(trigger).toHaveAttribute('aria-controls', region.id);
      expect(region).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('should render nothing when the items list is empty', () => {
      const { container } = render(<Accordion items={[]} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should build ids without spaces so aria IDREFs resolve', () => {
      render(
        <Accordion
          defaultValue="shipping address"
          items={[{ value: 'shipping address', title: 'Shipping', content: 'Shipping body' }]}
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Shipping' });
      const region = screen.getByRole('region');

      expect(trigger.id).not.toMatch(/\s/);
      expect(region.id).not.toMatch(/\s/);
      expect(document.getElementById(trigger.getAttribute('aria-controls') ?? '')).toBe(region);
    });

    it('should omit aria-controls when the closed panel is not mounted', () => {
      render(<Harness />);

      expect(screen.getByRole('button', { name: 'Shipping' })).not.toHaveAttribute('aria-controls');
    });
  });

  describe('single mode', () => {
    it('should open the item on click', () => {
      render(<Harness />);

      fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

      expect(screen.getByRole('region')).toHaveTextContent('Shipping body');
    });

    it('should close the previously open item', () => {
      render(<Harness defaultValue="shipping" />);

      fireEvent.click(screen.getByRole('button', { name: 'Billing' }));

      expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByRole('region')).toHaveTextContent('Billing body');
    });

    it('should report null when collapsing the open item', () => {
      const onValueChange = jest.fn();
      render(<Harness defaultValue="shipping" onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

      expect(onValueChange).toHaveBeenCalledWith(null);
    });

    it('should stay open when collapsible is false', () => {
      const onValueChange = jest.fn();
      render(<Harness defaultValue="shipping" collapsible={false} onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(screen.getByRole('region')).toHaveTextContent('Shipping body');
    });

    it('should not change state when controlled', () => {
      const onValueChange = jest.fn();
      render(<Harness value="shipping" onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Billing' }));

      expect(onValueChange).toHaveBeenCalledWith('billing');
      expect(screen.getByRole('region')).toHaveTextContent('Shipping body');
    });
  });

  describe('multiple mode', () => {
    it('should keep every opened item open', () => {
      render(<Harness mode="multiple" />);

      fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));
      fireEvent.click(screen.getByRole('button', { name: 'Billing' }));

      expect(screen.getAllByRole('region')).toHaveLength(2);
    });

    it('should emit a new array instead of mutating the current one', () => {
      const onValueChange = jest.fn();
      const defaultValue = ['shipping'];
      render(<Harness mode="multiple" defaultValue={defaultValue} onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Billing' }));

      const nextValue = onValueChange.mock.calls[0]?.[0];
      expect(nextValue).toEqual(['shipping', 'billing']);
      expect(nextValue).not.toBe(defaultValue);
      expect(defaultValue).toEqual(['shipping']);
    });

    it('should remove an item from the open list when toggled off', () => {
      const onValueChange = jest.fn();
      render(<Harness mode="multiple" defaultValue={['shipping', 'billing']} onValueChange={onValueChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));

      expect(onValueChange).toHaveBeenCalledWith(['billing']);
    });
  });

  describe('disabled and icon', () => {
    it('should not toggle a disabled item', () => {
      render(
        <Accordion
          items={[{ value: 'locked', title: 'Locked', content: 'Locked body', disabled: true }]}
        />,
      );

      const trigger = screen.getByRole('button', { name: 'Locked' });
      fireEvent.click(trigger);

      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('should use chevron-down by default and hide the indicator from assistive tech', () => {
      render(<Harness />);

      const icon = screen.getAllByTestId('icon-chevron-down')[0];

      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should let the item icon override the root icon', () => {
      render(<Harness icon={<span data-testid="root-icon" />} />);

      expect(screen.getAllByTestId('root-icon')).toHaveLength(1);
      expect(screen.getByTestId('item-icon')).toBeInTheDocument();
    });
  });

  describe('forceMount', () => {
    it('should keep closed panels mounted but collapsed', () => {
      render(<Harness forceMount />);

      const panel = screen.getByText('Shipping body').closest('[role="region"]');

      expect(panel).toBeInTheDocument();
      expect(panel).toHaveClass('grid-rows-[0fr]');
      // O filho direto do grid precisa colapsar; o padding vive num nível
      // interno, senão a altura intrínseca mantém o painel visível.
      expect(panel?.firstElementChild).toHaveClass('min-h-0');
      expect(panel?.firstElementChild).not.toHaveClass('pb-4');
    });

    it('should keep a closed force-mounted panel out of the focus tree', () => {
      render(<Harness forceMount />);

      const panel = screen.getByText('Shipping body').closest('[role="region"]');

      expect(panel).toHaveAttribute('inert');
    });

    it('should not mark the open panel as inert', () => {
      render(<Harness defaultValue="shipping" />);

      expect(screen.getByRole('region')).not.toHaveAttribute('inert');
    });
  });
});