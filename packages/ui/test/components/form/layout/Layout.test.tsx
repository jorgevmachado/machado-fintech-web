import React from 'react';
import { render ,screen } from '@testing-library/react';

import { FormLayout } from '../../../../src/components/form/layout';

type TestFieldProps = {
  name: string;
};

function TestField({ name }: TestFieldProps) {
  return (
    <div data-testid={`field-${name}`} data-name={name}>
      {name}
    </div>
  );
}

describe('FormLayout', () => {
  describe('render', () => {
    it('should render all children', () => {
      render(
        <FormLayout>
          <TestField name="name" />
          <TestField name="email" />
          <TestField name="phone" />
        </FormLayout>
      );

      expect(
        screen.getByTestId('field-name')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('field-email')
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('field-phone')
      ).toBeInTheDocument();
    });

    it('should ignore children without a name', () => {
      render(
        <FormLayout>
          <TestField name="name" />
          <div data-testid="without-name">
            Without name
          </div>
        </FormLayout>
      );

      expect(
        screen.getByTestId('field-name')
      ).toBeInTheDocument();

      expect(
        screen.queryByTestId('without-name')
      ).not.toBeInTheDocument();
    });
  });

  describe('columns', () => {
    it('should use one column by default', () => {
      const { container } = render(
        <FormLayout>
          <TestField name="name" />
        </FormLayout>
      );

      expect(container.firstElementChild).toHaveStyle({
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      });
    });

    it('should use the configured number of columns', () => {
      const { container } = render(
        <FormLayout cols={2}>
          <TestField name="name" />
          <TestField name="email" />
        </FormLayout>
      );

      expect(container.firstElementChild).toHaveStyle({
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      });
    });
  });

  describe('gap', () => {
    it('should use the default gap', () => {
      const { container } = render(
        <FormLayout>
          <TestField name="name" />
        </FormLayout>
      );

      expect(container.firstElementChild).toHaveStyle({
        gap: '0.25rem',
      });
    });

    it('should apply the configured gap', () => {
      const { container } = render(
        <FormLayout gap={4}>
          <TestField name="name" />
        </FormLayout>
      );

      expect(container.firstElementChild).toHaveStyle({
        gap: '1rem',
      });
    });
  });

  describe('field ordering', () => {
    it('should follow the layout field order', () => {
      const { container } = render(
        <FormLayout
          cols={2}
          fields={[
            { name: 'email', span: 2 },
            { name: 'name', span: 2 },
            { name: 'password' },
            { name: 'password_confirmation' },
          ]}
        >
          <TestField name="name" />
          <TestField name="email" />
          <TestField name="password" />
          <TestField name="password_confirmation" />
          <TestField name="phone" />
        </FormLayout>
      );

      const fields = Array.from(
        container.querySelectorAll('[data-testid^="field-"]')
      );

      expect(fields.map((field) => field.textContent)).toEqual([
        'email',
        'name',
        'password',
        'password_confirmation',
        'phone',
      ]);
    });

    it('should append fields not configured in layout', () => {
      const { container } = render(
        <FormLayout
          fields={[
            { name: 'email' },
            { name: 'name' },
          ]}
        >
          <TestField name="name" />
          <TestField name="email" />
          <TestField name="phone" />
        </FormLayout>
      );

      const fields = Array.from(
        container.querySelectorAll('[data-testid^="field-"]')
      );

      expect(fields.map((field) => field.textContent)).toEqual([
        'email',
        'name',
        'phone',
      ]);
    });
  });

  describe('field span', () => {
    it('should use span one by default', () => {
      const { container } = render(
        <FormLayout cols={2}>
          <TestField name="name" />
        </FormLayout>
      );

      const wrapper = container
      .querySelector('[data-testid="field-name"]')
        ?.parentElement;

      expect(wrapper).toHaveStyle({
        gridColumn: 'span 1',
      });
    });

    it('should apply the configured span', () => {
      const { container } = render(
        <FormLayout
          cols={2}
          fields={[
            { name: 'email', span: 2 },
          ]}
        >
          <TestField name="email" />
        </FormLayout>
      );

      const wrapper = container
      .querySelector('[data-testid="field-email"]')
        ?.parentElement;

      expect(wrapper).toHaveStyle({
        gridColumn: 'span 2',
      });
    });

    it('should limit span to the number of columns', () => {
      const { container } = render(
        <FormLayout
          cols={2}
          fields={[
            { name: 'email', span: 5 },
          ]}
        >
          <TestField name="email" />
        </FormLayout>
      );

      const wrapper = container
      .querySelector('[data-testid="field-email"]')
        ?.parentElement;

      expect(wrapper).toHaveStyle({
        gridColumn: 'span 2',
      });
    });
  });

  describe('duplicated layout fields', () => {
    it('should ignore duplicated field names', () => {
      const { container } = render(
        <FormLayout
          fields={[
            { name: 'email', span: 2 },
            { name: 'email', span: 1 },
          ]}
        >
          <TestField name="email" />
          <TestField name="name" />
        </FormLayout>
      );

      const fields = Array.from(
        container.querySelectorAll('[data-testid^="field-"]')
      );

      expect(fields.map((field) => field.textContent)).toEqual([
        'email',
        'name',
      ]);
    });
  });

  describe('className', () => {
    it('should apply the custom className', () => {
      const { container } = render(
        <FormLayout className="custom-layout">
          <TestField name="name" />
        </FormLayout>
      );

      expect(container.firstElementChild).toHaveClass(
        'custom-layout'
      );
    });
  });

  describe('field ordering', () => {
    it('should ignore layout fields that do not have a matching child', () => {
      const { container } = render(
        <FormLayout
          fields={[
            { name: 'email', span: 2 },
            { name: 'unknown', span: 2 },
            { name: 'name' },
          ]}
        >
          <TestField name="email" />
          <TestField name="name" />
        </FormLayout>
      );

      const fields = Array.from(
        container.querySelectorAll('[data-testid^="field-"]')
      );

      expect(fields.map((field) => field.textContent)).toEqual([
        'email',
        'name',
      ]);

      expect(
        screen.queryByTestId('field-unknown')
      ).not.toBeInTheDocument();
    });
  });
});