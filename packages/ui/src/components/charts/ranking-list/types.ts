export type RankingListItem = {
  id: string;
  label: string;
  value: number;
  count: number;
};

export type RankingListProps = {
  data: Array<RankingListItem>;
  limit?: number;
  colors?: Array<string>;
  opacities?: Array<number>;
  valueFormatter?: (value: number) => string;
  countFormatter?: (count: number) => string;
};