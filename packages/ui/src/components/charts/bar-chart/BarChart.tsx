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

import {
  TOOLTIP_CONTENT_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
} from '../tooltip';

/**
 * Paleta das séries, escolhida para passar 3:1 (mínimo para objeto gráfico)
 * tanto sobre `--app-surface` claro (`#ffffff`) quanto escuro (`#17233d`).
 *
 * A faixa de luminância que satisfaz os dois é estreita (0.152–0.300), então
 * três cores saíram: `amber-500` (`#f59e0b`, 2.15:1 no claro) virou
 * `amber-600`; `indigo-600` (`#4f46e5`, 2.70:1 no escuro) virou `indigo-500`;
 * `violet-600` (`#9333ea`, 2.90:1 no escuro) virou `violet-500`.
 */
const BAR_COLORS = [
  '#2563eb' ,
  '#16a34a' ,
  '#d97706' ,
  '#dc2626' ,
  '#a855f7' ,
  '#0891b2' ,
  '#ea580c' ,
  '#6366f1' ,
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
          /*
           * O tooltip é HTML absoluto, não SVG, então `var()` funciona aqui —
           * diferente do grid/eixos, que são atributos de apresentação SVG e
           * são tratados por CSS em `styles.css`.
           */
          contentStyle={ TOOLTIP_CONTENT_STYLE }
          labelStyle={ TOOLTIP_LABEL_STYLE }
          itemStyle={ TOOLTIP_ITEM_STYLE }
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
