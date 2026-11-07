'use client';
import { useEffect ,useState } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import useBeneficiaries from '@/src/features/beneficiary/hooks/use-beneficiaries';
import { Beneficiary ,TBeneficiaryPersist } from '@/src/features/beneficiary/domain';
import { Delete } from '@/src/components';

import { BeneficiaryForm ,BeneficiaryList } from '@/src/features/beneficiary/components';

type ViewMode = 'list' | 'form';

export default function BeneficiaryPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useBeneficiaries();
  const [mode, setMode] = useState<ViewMode>('list');
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | undefined>(undefined);

  const handleNew = () => {
    setEditingBeneficiary(undefined);
    setMode('form');
  }

  const handleEdit = (beneficiary: Beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setMode('form');
  }

  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: Beneficiary) => {
    openModal({
      title: `beneficiary.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const handleSubmit = async (item: TBeneficiaryPersist) => {
    const response = await persist(item);
    if(response) {
      setMode('list');
      setEditingBeneficiary(undefined);
    }
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  if(mode === 'form') {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" className="text-2xl font-bold">{editingBeneficiary ? 'beneficiary.edit.title' : 'beneficiary.create.title'}</Text>
        </div>
        <BeneficiaryForm
          item={editingBeneficiary}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingBeneficiary(undefined); }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">beneficiary.title</Text>
        <Button onClick={handleNew}>beneficiary.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground">beneficiary.loading</Text>
      ) : (
        <>
          <BeneficiaryList
            items={items}
            onEdit={handleEdit}
            onDelete={openModalDelete}
          />
          {meta && items.length && (
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