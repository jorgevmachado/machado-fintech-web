'use client';
import { useEffect } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import useBeneficiaries from '@/src/features/beneficiary/hooks/use-beneficiaries';
import { Beneficiary ,TBeneficiaryPersist } from '@/src/features/beneficiary/domain';
import { Delete } from '@/src/components';

import { BeneficiaryForm ,BeneficiaryList } from '@/src/features/beneficiary/components';

export default function BeneficiaryPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useBeneficiaries();


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

  const openModalForm = (item?: Beneficiary) => {
    openModal({
      title: item?.id ? `beneficiary.edit.title, {name: ${item.name}}` : 'beneficiary.create.title',
      children: <BeneficiaryForm key={item?.id ?? 'new'} item={item} onSubmit={handleSubmit} onCancel={closeModal} />,
    });
  }

  const handleSubmit = async (item: TBeneficiaryPersist) => {
    await persist(item);
    closeModal();
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" color="text-[color:var(--app-text-strong,#020617)]" className="text-2xl font-bold">beneficiary.title</Text>
        <Button onClick={() => openModalForm()}>beneficiary.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-[color:var(--app-text-muted,#64748b)]">beneficiary.loading</Text>
      ) : (
        <>
          <BeneficiaryList
            items={items}
            onEdit={openModalForm}
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