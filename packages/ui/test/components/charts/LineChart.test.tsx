import React from 'react';
import { render, screen } from '@testing-library/react';

import { LineChart } from '../../../src';

jest.mock('recharts', () => {
  return {
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Line: ({ dataKey, name }: { dataKey: string; name: string }) => (
      <div data-testid={`line-${dataKey}`} data-name={name} />
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
    XAxis: ({ dataKey }: { dataKey: string }) => (
      <div data-testid="x-axis" data-key={dataKey} />
    ),
    YAxis: () => <div data-testid="y-axis" />,
    LineChart: ({
      children,
      data,
    }: {
      children: React.ReactNode;
      data: unknown[];
    }) => <div data-testid="line-chart" data-count={data.length}>{children}</div>,
  };
});

describe('<LineChart />', () => {
  const data = [{ month: 'Jan', sales: 12 }];
  const series = [{ dataKey: 'sales', label: 'Sales' }];

  it('renders default dimensions and series', () => {
    render(<LineChart data={data} series={series} xAxisKey="month" />);

    expect(screen.getByTestId('responsive-container')).toHaveAttribute(
      'data-height',
      '300',
    );
    expect(screen.getByTestId('line-chart')).toHaveAttribute('data-count', '1');
    expect(screen.getByTestId('x-axis')).toHaveAttribute('data-key', 'month');
    expect(screen.getByTestId('line-sales')).toHaveAttribute('data-name', 'Sales');
    expect(screen.getByTestId('tooltip-number')).toHaveTextContent('12');
    expect(screen.getByTestId('tooltip-text')).toHaveTextContent('label');
  });

  it('uses the tooltip formatter when both numeric formatters are supplied', () => {
    render(
      <LineChart
        data={data}
        series={series}
        xAxisKey="month"
        height={420}
        valueFormatter={(value) => `value:${value}`}
        tooltipFormatter={(value) => `tooltip:${value}`}
        xAxisFormatter={(value) => value.toUpperCase()}
      />,
    );

    expect(screen.getByTestId('responsive-container')).toHaveAttribute(
      'data-height',
      '420',
    );
    expect(screen.getByTestId('tooltip-number')).toHaveTextContent(
      'tooltip:12',
    );
  });

  it('uses the value formatter when no tooltip formatter is supplied', () => {
    render(
      <LineChart
        data={data}
        series={series}
        xAxisKey="month"
        valueFormatter={(value) => `value:${value}`}
      />,
    );

    expect(screen.getByTestId('tooltip-number')).toHaveTextContent('value:12');
  });
});
