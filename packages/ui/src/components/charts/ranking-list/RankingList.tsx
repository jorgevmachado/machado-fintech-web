import { Text } from '../../../primitives';

import { RankingListProps } from './types';


const BAR_COLORS = [
  '#2563eb',
  '#3b82f6',
  '#60a5fa',
  '#93c5fd',
  '#bfdbfe',
];
const BAR_OPACITIES = [1, 0.75, 0.5];

export default function RankingList({
  data,
  limit = 5,
  colors = BAR_COLORS,
  opacities = BAR_OPACITIES,
  valueFormatter = (value) => String(value),
  countFormatter = (count) => String(count),
}: RankingListProps) {

  const items = [...data]
  .sort((a, b) => b.value - a.value)
  .slice(0, limit);

  const total = items.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  if (items.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Text as="p" className="text-sm text-slate-400">
          Nenhum dado encontrado.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const percentage =
          total > 0 ? (item.value / total) * 100 : 0;

        return (
          <div key={item.id}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Text as="p" className="truncate text-sm font-medium text-slate-700">
                  {item.label}
                </Text>

                <Text as="p" className="text-xs text-slate-400">
                  {countFormatter(item.count)}
                </Text>
              </div>

              <div className="shrink-0 text-right">
                <Text as="p" className="text-sm font-semibold text-slate-900">
                  {valueFormatter(item.value)}
                </Text>

                <Text as="p" className="text-xs text-slate-400">
                  {percentage.toFixed(1)}%
                </Text>
              </div>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: colors[index] ?? 'bg-blue-300',
                  opacity: opacities[index] ?? 0.4
                }}
              />
            </div>

            {index < items.length - 1 && (
              <div className="mt-4 border-b border-slate-100" />
            )}
          </div>
        );
      })}
    </div>
  );
}