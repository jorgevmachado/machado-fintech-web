import React from 'react';
import { render, screen } from '@testing-library/react';

import { BarChart } from '../../../src';

jest.mock('recharts', () => {
  return {
    Bar: ({
      dataKey,
      name,
      shape,
    }: {
      dataKey: string;
      name: string;
      shape: (props: { index?: number }) => React.ReactNode;
    }) => (
      <div data-testid={`bar-${dataKey}`} data-name={name}>
        {shape({ index: 1 })}
        {shape({})}
      </div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Rectangle: ({ fill }: { fill: string }) => (
      <span data-testid="rectangle" data-fill={fill} />
    ),
    ResponsiveContainer: ({
      children,
      height,
    }: {
      children: React.ReactNode;
      height: number;
    }) => (
      <div data-testid="responsive-container" data-height={height}>
        {children}
      </div>
    ),
    Tooltip: ({
      formatter,
    }: {
      formatter: (value: number | string) => React.ReactNode;
    }) => (
      <div data-testid="tooltip">
        <span data-testid="tooltip-number">{formatter(12)}</span>
        <span data-testid="tooltip-text">{formatter('label')}</span>
      </div>
    ),
    XAxis: ({
      dataKey,
      type,
    }: {
      dataKey?: string;
      type?: string;
    }) => (
      <div data-testid="x-axis" data-key={dataKey} data-type={type} />
    ),
    YAxis: ({
      dataKey,
      type,
    }: {
      dataKey?: string;
      type?: string;
    }) => (
      <div data-testid="y-axis" data-key={dataKey} data-type={type} />
    ),
    BarChart: ({
      children,
      data,
      layout,
    }: {
      children: React.ReactNode;
      data: unknown[];
      layout: string;
    }) => (
      <div data-testid="bar-chart" data-count={data.length} data-layout={layout}>
        {children}
      </div>
    ),
  };
});

describe('<BarChart />', () => {
  const data = [{ month: 'Jan', sales: 12 }];
  const series = [{ dataKey: 'sales', label: 'Sales' }];

  it('renders the default horizontal chart and default colors', () => {
    render(<BarChart data={data} series={series} xAxisKey="month" />);

    expect(screen.getByTestId('responsive-container')).toHaveAttribute(
      'data-height',
      '360',
    );
    expect(screen.getByTestId('bar-chart')).toHaveAttribute(
      'data-layout',
      'horizontal',
    );
    expect(screen.getByTestId('x-axis')).toHaveAttribute('data-key', 'month');
    expect(screen.getByTestId('bar-sales')).toHaveAttribute('data-name', 'Sales');
    expect(screen.getAllByTestId('rectangle')[0]).toHaveAttribute(
      'data-fill',
      '#16a34a',
    );
    expect(screen.getAllByTestId('rectangle')[1]).toHaveAttribute(
      'data-fill',
      '#2563eb',
    );
  });

  it('renders vertical axes and supports custom dimensions, colors, and formatters', () => {
    const valueFormatter = (value: number) => `value:${value}`;
    const tooltipFormatter = (value: number) => `tooltip:${value}`;
    const yAxisFormatter = (value: string | number) => `axis:${value}`;

    render(
      <BarChart
        data={data}
        series={series}
        xAxisKey="month"
        layout="vertical"
        height={240}
        colors={['red', 'blue']}
        valueFormatter={valueFormatter}
        tooltipFormatter={tooltipFormatter}
        yAxisFormatter={yAxisFormatter}
      />,
    );

    expect(screen.getByTestId('responsive-container')).toHaveAttribute(
      'data-height',
      '240',
    );
    expect(screen.getByTestId('bar-chart')).toHaveAttribute(
      'data-layout',
      'vertical',
    );
    expect(screen.getByTestId('x-axis')).toHaveAttribute('data-type', 'number');
    expect(screen.getByTestId('y-axis')).toHaveAttribute(
      'data-type',
      'category',
    );
    expect(screen.getAllByTestId('rectangle')[0]).toHaveAttribute(
      'data-fill',
      'blue',
    );
    expect(screen.getByTestId('tooltip-number')).toHaveTextContent(
      'tooltip:12',
    );
    expect(screen.getByTestId('tooltip-text')).toHaveTextContent('label');
  });

  it('uses the value formatter for numeric tooltips when no tooltip formatter is given', () => {
    render(
      <BarChart
        data={data}
        series={series}
        xAxisKey="month"
        valueFormatter={(value) => `formatted:${value}`}
      />,
    );

    expect(screen.getByTestId('tooltip-number')).toHaveTextContent(
      'formatted:12',
    );
  });

  it('returns numeric tooltip values unchanged when no formatter is given', () => {
    render(<BarChart data={data} series={series} xAxisKey="month" />);

    expect(screen.getByTestId('tooltip-number')).toHaveTextContent('12');
  });
});
