'use client';

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { LineChartProps } from './types';

import {
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../tooltip';

export default function LineChart({
  data,
  height = 300,
  series,
  xAxisKey,
  valueFormatter,
  xAxisFormatter,
  tooltipFormatter
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{top: 16, right: 24, left: 16, bottom: 24}}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tickFormatter={xAxisFormatter}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={valueFormatter}
          width={100}
          tickMargin={8}
        />

        <Tooltip
          contentStyle={TOOLTIP_CONTENT_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          formatter={(value) => {
            if (typeof value !== 'number') {
              return value;
            }

            return valueFormatter
              ? tooltipFormatter
                ? tooltipFormatter(value)
                : valueFormatter(value)
              : value;
          }}
        />


        {series.map(({ dataKey, label }) => (
          <Line
            key={dataKey}
            type="monotone"
            dataKey={dataKey}
            name={label}
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
            }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
