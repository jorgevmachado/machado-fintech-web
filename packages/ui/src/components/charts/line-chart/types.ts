export type LineChartData = Record<string, string | number>;

export type LineChartSeries = {
  dataKey: string;
  label: string;
};


export type LineChartProps = {
  data: Array<LineChartData>;
  height?: number;
  series: Array<LineChartSeries>;
  xAxisKey: string;
  valueFormatter?: (value: number) => string;
  xAxisFormatter?: (value: string) => string;
  tooltipFormatter?: (value: number) => string;
}