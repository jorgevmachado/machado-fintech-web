'use client';
import { useEffect ,useState } from 'react';
import { Button ,Lang ,Pagination ,useModal, Text } from '@fintech/ui';
import usePayers from '@/src/features/payer/hooks/use-payers';
import { Payer ,TPayerPersist } from '@/src/features/payer/domain';
import { Delete } from '@/src/components';

import { PayerForm ,PayerList } from '@/src/features/payer/components';

type ViewMode = 'list' | 'form';

export default function PayerPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = usePayers();
  const [mode, setMode] = useState<ViewMode>('list');
  const [editingPayer, setEditingPayer] = useState<Payer | undefined>(undefined);

  const handleNew = () => {
    setEditingPayer(undefined);
    setMode('form');
  }

  const handleEdit = (payer: Payer) => {
    setEditingPayer(payer);
    setMode('form');
  }

  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: Payer) => {
    openModal({
      title: `payer.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const handleSubmit = async (item: TPayerPersist) => {
    const response = await persist(item);
    if(response) {
      setMode('list');
      setEditingPayer(undefined);
    }
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  if(mode === 'form') {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" className="text-2xl font-bold">
            {editingPayer
              ? <Lang langKey="payer.edit.title" values={{ name: editingPayer.name }} />
              : 'payer.create.title'}
          </Text>
        </div>
        <PayerForm
          item={editingPayer}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingPayer(undefined); }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">payer.title</Text>
        <Button onClick={handleNew}>payer.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground">payer.loading</Text>
      ) : (
        <>
          <PayerList
            items={items}
            onEdit={handleEdit}
            onDelete={openModalDelete}
          />
          {meta && items.length > 0 && (
            <div className="mt-5 sm:mt-6">
              <Pagination
                isLoading={isLoading}
                totalPages={meta.total_pages}
                currentPage={meta.current_page}
                onPageChange={(page) => goToPage(page)}
              />
            </div>
          )}
        </>
      )}
      {modal}
    </div>
  )
}