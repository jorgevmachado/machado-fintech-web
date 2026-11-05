'use client';

import {
  Bar ,
  BarChart as RechartsBarChart ,
  CartesianGrid ,
  Rectangle ,
  ResponsiveContainer ,
  Tooltip ,
  XAxis ,
  YAxis ,
} from 'recharts';

import type { BarChartProps } from './types';

const BAR_COLORS = [
  '#2563eb' ,
  '#16a34a' ,
  '#f59e0b' ,
  '#dc2626' ,
  '#9333ea' ,
  '#0891b2' ,
  '#ea580c' ,
  '#4f46e5' ,
  '#0d9488' ,
  '#c026d3' ,
];

export default function BarChart({
  data ,
  colors = BAR_COLORS ,
  height = 360 ,
  series ,
  xAxisKey ,
  layout = 'horizontal' ,
  yAxisFormatter ,
  valueFormatter ,
  tooltipFormatter ,
}: BarChartProps) {
  const isVertical = layout === 'vertical';

  return (
    <ResponsiveContainer width="100%" height={ height }>
      <RechartsBarChart
        data={ data }
        layout={ layout }
        margin={ {
          top: 16 ,
          right: 24 ,
          left: 16 ,
          bottom: 24 ,
        } }
      >
        <CartesianGrid
          horizontal={ false }
          strokeDasharray="3 3"
        />

        { isVertical ? (
          <>
            <XAxis
              type="number"
              axisLine={ false }
              tickLine={ false }
              tickFormatter={ valueFormatter }
            />

            <YAxis
              type="category"
              dataKey={ xAxisKey }
              axisLine={ false }
              tickLine={ false }
              tickFormatter={ yAxisFormatter }
              width={ 160 }
              interval={ 0 }
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={ xAxisKey }
              axisLine={ false }
              tickLine={ false }
              tickFormatter={ valueFormatter }
            />

            <YAxis
              axisLine={ false }
              tickLine={ false }
              tickFormatter={ yAxisFormatter }
              width={ 100 }
            />
          </>
        ) }

        <Tooltip
          formatter={ (value) => {
            if (typeof value !== 'number') {
              return value;
            }

            if (tooltipFormatter) {
              return tooltipFormatter(value);
            }

            if (valueFormatter) {
              return valueFormatter(value);
            }

            return value;
          } }
        />

        { series.map(({ dataKey ,label }) => (
          <Bar
            key={ dataKey }
            dataKey={ dataKey }
            name={ label }
            radius={ [0 ,4 ,4 ,0] }
            shape={ ({ index ,...rest }) => (
              <Rectangle
                { ...rest }
                fill={ colors[(index ?? 0) % colors.length] }
              />
            ) }
          />
        )) }
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
