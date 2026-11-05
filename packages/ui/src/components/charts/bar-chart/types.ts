export type BarChartData = Record<string, string | number>;

export type BarChartSeries = {
  dataKey: string;
  label: string;
};

export type BarChartProps = {
  data: Array<BarChartData>;
  colors?: Array<string>;
  height?: number;
  series: Array<BarChartSeries>;
  layout?: 'horizontal' | 'vertical';
  xAxisKey: string;
  yAxisFormatter?: (value: string | number) => string;
  valueFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
};