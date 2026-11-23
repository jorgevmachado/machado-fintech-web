import { render, screen } from '@testing-library/react';

import { RankingList } from '../../../src';

describe('<RankingList />', () => {
  it('renders an empty state', () => {
    render(<RankingList data={[]} />);

    expect(screen.getByText('Nenhum dado encontrado.')).toBeInTheDocument();
  });

  it('sorts values, limits results, and formats default content', () => {
    render(
      <RankingList
        data={[
          { id: 'first', label: 'First', value: 10, count: 2 },
          { id: 'second', label: 'Second', value: 30, count: 4 },
          { id: 'third', label: 'Third', value: 20, count: 3 },
        ]}
        limit={2}
      />,
    );

    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });

  it('uses custom formatters and fallback colors and opacities', () => {
    const data = Array.from({ length: 6 }, (_, index) => ({
      id: `item-${index}`,
      label: `Item ${index}`,
      value: 0,
      count: index,
    }));

    const { container } = render(
      <RankingList
        data={data}
        colors={[]}
        opacities={[]}
        valueFormatter={(value) => `value-${value}`}
        countFormatter={(count) => `count-${count}`}
      />,
    );

    expect(screen.getAllByText('value-0')).toHaveLength(5);
    expect(screen.getAllByText('count-0')).toHaveLength(1);
    expect(screen.getAllByText('0.0%')).toHaveLength(5);
    const bars = container.querySelectorAll('.mt-2 > div');
    expect(bars).toHaveLength(5);
    bars.forEach((bar) => {
      // Fallback = último degrau de `BAR_OPACITIES`, o mínimo que mantém 3:1
      // nos dois temas. Era 0.4, que sumia no claro.
      expect(bar).toHaveStyle({ opacity: 0.7 });
    });
  });

  it('should paint the bars with the theme accent instead of a light-only blue scale', () => {
    // A escala anterior ia de `#2563eb` a `#bfdbfe`; o extremo claro dela dava
    // 1.65:1 contra o trilho escuro — a barra do 5º item sumia no dark.
    const { container } = render(
      <RankingList
        data={[
          { id: 'a', label: 'A', value: 10, count: 1 },
          { id: 'b', label: 'B', value: 5, count: 1 },
        ]}
      />,
    );

    const bars = Array.from(container.querySelectorAll<HTMLElement>('.mt-2 > div'));
    expect(bars).toHaveLength(2);

    // Lido do atributo, não de `style.backgroundColor`: o jsdom descarta
    // `var()` em propriedades de cor, então a leitura tipada voltaria vazia.
    for (const bar of bars) {
      expect(bar.getAttribute('style')).toContain('var(--app-accent');
    }
  });

  it('should keep every default bar opacity readable in both themes', () => {
    // 0.7 é o piso: sobre `--app-surface-muted` ele ainda passa 3:1 no claro e
    // no escuro. Opacidades menores (a escala antiga chegava a 0.5) reprovavam.
    const { container } = render(
      <RankingList
        data={[1, 2, 3, 4].map((n) => ({ id: `i${n}`, label: `I${n}`, value: n, count: n }))}
      />,
    );

    const bars = Array.from(container.querySelectorAll<HTMLElement>('.mt-2 > div'));
    for (const bar of bars) {
      expect(Number(bar.style.opacity)).toBeGreaterThanOrEqual(0.7);
    }
  });
});
