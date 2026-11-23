import { Text } from '../../../primitives';

import { RankingListProps } from './types';


/**
 * A barra usa o acento do tema e varia só a opacidade. A escala fixa anterior
 * (`#2563eb` → `#bfdbfe`) só funcionava no claro: no escuro o extremo dela
 * dava 1.65:1 contra o trilho, praticamente invisível.
 */
const BAR_COLORS = ['var(--app-accent, #1d4ed8)'];

/**
 * Opacidades válidas para os dois temas. Sobre o trilho `--app-surface-muted`,
 * 0.7 é o mínimo que ainda passa 3:1 no claro (3.39:1) e no escuro (4.60:1);
 * abaixo disso a barra some no claro.
 */
const BAR_OPACITIES = [1, 0.85, 0.7];

/**
 * Cor de fallback quando `colors` não cobre o índice. Precisa ser um valor CSS
 * real: antes era a classe `bg-blue-300`, que em `backgroundColor` é inválida e
 * o browser descarta — a barra ficava sem fundo.
 */
const FALLBACK_BAR_COLOR = BAR_COLORS[0];

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
        <Text as="p" className="text-sm text-[color:var(--app-text-muted,#64748b)]">
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
                <Text as="p" className="truncate text-sm font-medium text-[color:var(--app-text,#0f172a)]">
                  {item.label}
                </Text>

                <Text as="p" className="text-xs text-[color:var(--app-text-muted,#64748b)]">
                  {countFormatter(item.count)}
                </Text>
              </div>

              <div className="shrink-0 text-right">
                <Text as="p" className="text-sm font-semibold text-[color:var(--app-text-strong,#020617)]">
                  {valueFormatter(item.value)}
                </Text>

                <Text as="p" className="text-xs text-[color:var(--app-text-muted,#64748b)]">
                  {percentage.toFixed(1)}%
                </Text>
              </div>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--app-surface-muted,#f1f5f9)]">
              <div
                className={`h-full rounded-full`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: colors[index] ?? FALLBACK_BAR_COLOR,
                  // O piso vem de `BAR_OPACITIES`: um valor solto aqui (era
                  // 0.4) furava o mínimo de contraste justamente no item do fim.
                  opacity: opacities[index] ?? BAR_OPACITIES[BAR_OPACITIES.length - 1]
                }}
              />
            </div>

            {index < items.length - 1 && (
              <div className="mt-4 border-b border-[color:var(--app-border,#e2e8f0)]" />
            )}
          </div>
        );
      })}
    </div>
  );
}