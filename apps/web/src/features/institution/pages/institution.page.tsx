'use client';
import { useEffect } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import useInstitutions from '@/src/features/institution/hooks/use-institutions';
import { Institution ,TInstitutionPersist } from '@/src/features/institution/domain';
import { Delete } from '@/src/components';

import { InstitutionForm ,InstitutionList } from '@/src/features/institution/components';

export default function InstitutionPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useInstitutions();

  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: Institution) => {
    openModal({
      title: `institution.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const openModalForm = (item?: Institution) => {
    openModal({
      title: item?.id ? `institution.edit.title, {name: ${item.name}}` : 'institution.create.title',
      children: <InstitutionForm key={item?.id ?? 'new'} item={item} onSubmit={handleSubmit} onCancel={closeModal} />,
    });
  }

  const handleSubmit = async (item: TInstitutionPersist) => {
    await persist(item);
    closeModal();
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" color="text-[color:var(--app-text-strong,#020617)]" className="text-2xl font-bold">institution.title</Text>
        <Button onClick={() => openModalForm()}>institution.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-[color:var(--app-text-muted,#64748b)]">beneficiary.loading</Text>
      ) : (
        <>
          <InstitutionList
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