'use client';
import { useEffect ,useState } from 'react';

import { Button ,useModal } from '@fintech/ui';

import { Delete ,PageSectionHeader } from '@/src/components';
import type { TransactionOptionsResult } from '@/src/features/transactions/transaction/hooks/use-transaction-options';
import {
  useTransactionSeries ,
  type TTransactionSeriesPersist,
} from '@/src/features/transactions/transaction-series';
import TransactionSeriesForm
  ,{ SERIES_KIND_LABELS } from '@/src/features/transactions/statement/components/transaction-series-form';

type SeriesEditViewProps = {
  seriesId: string;
  options: TransactionOptionsResult;
  onNotFound: (message: string) => void;
  onCancel: () => void;
  onDone: () => void;
};

/**
 * The same form of the creation, filled with the stored series. Its only entry
 * point is an occurrence, so the way back returns to that occurrence.
 */
export default function SeriesEditView({
  seriesId,
  options,
  onNotFound,
  onCancel,
  onDone,
}: SeriesEditViewProps) {
  const { modal, openModal, closeModal } = useModal();
  const { series, isLoading, error, fetchById, persist, remove } = useTransactionSeries(seriesId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void fetchById(seriesId).then((loaded) => {
      if (!loaded) onNotFound('Série não encontrada.');
    });
  }, [fetchById, onNotFound, seriesId]);

  async function handleSubmit(input: TTransactionSeriesPersist) {
    setIsSubmitting(true);
    try {
      const response = await persist({ ...input, id: seriesId });
      if (response) onDone();
    } finally {
      setIsSubmitting(false);
    }
  }

  function openDeleteDialog() {
    if (!series) return;

    openModal({
      title: 'Excluir série',
      children: (
        <Delete
          identifier={series.id}
          title="Excluir série"
          description="A série deixará de gerar ocorrências e as ocorrências dela já alteradas ou efetivadas deixarão de aparecer no extrato e nos relatórios."
          itemLabel="Série"
          itemValue={series.name}
          onClose={closeModal}
          onSubmit={async (identifier) => {
            const wasRemoved = await remove(identifier);
            closeModal();
            if (wasRemoved) onDone();
          }}
        />
      ),
    });
  }

  function renderBody() {
    if (isLoading) {
      return <p className="text-sm text-[color:var(--app-text-muted,#64748b)]">Carregando série...</p>;
    }
    if (!series) {
      return error ? <p className="text-sm text-red-600">{error}</p> : null;
    }

    return (
      // Remounted per series: the stored values apply on mount, never through an effect reset.
      <TransactionSeriesForm
        key={series.id}
        item={series}
        options={options}
        isLoadingOptions={options.isLoading}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageSectionHeader
        badge="Extrato Mensal"
        title="Editar série"
        subtitle={series ? SERIES_KIND_LABELS[series.kind] : undefined}
        aside={
          series ? (
            <Button
              type="button"
              appearance="outline"
              size="sm"
              iconLeft="trash"
              tone="danger"
              onClick={openDeleteDialog}
            >
              Excluir série
            </Button>
          ) : undefined
        }
      />

      {options.error ? <p className="text-sm text-red-600">{options.error}</p> : null}
      {renderBody()}
      {modal}
    </div>
  );
}