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
      expect(bar).toHaveStyle({ opacity: 0.4 });
    });
  });
});
