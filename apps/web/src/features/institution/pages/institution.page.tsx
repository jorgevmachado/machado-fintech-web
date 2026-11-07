'use client';
import { useEffect ,useState } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import useInstitutions from '@/src/features/institution/hooks/use-institutions';
import { Institution ,TInstitutionPersist } from '@/src/features/institution/domain';
import { Delete } from '@/src/components';

import { InstitutionForm ,InstitutionList } from '@/src/features/institution/components';

type ViewMode = 'list' | 'form';

export default function InstitutionPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useInstitutions();
  const [mode, setMode] = useState<ViewMode>('list');
  const [editingInstitution, setEditingInstitution] = useState<Institution | undefined>(undefined);

  const handleNew = () => {
    setEditingInstitution(undefined);
    setMode('form');
  }

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution);
    setMode('form');
  }

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

  const handleSubmit = async (item: TInstitutionPersist) => {
    const response = await persist(item);
    if(response) {
      setMode('list');
      setEditingInstitution(undefined);
    }
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  if(mode === 'form') {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" className="text-2xl font-bold">{editingInstitution ? 'institution.edit.title' : 'institution.create.title'}</Text>
        </div>
        <InstitutionForm
          item={editingInstitution}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingInstitution(undefined); }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">institution.title</Text>
        <Button onClick={handleNew}>institution.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground">beneficiary.loading</Text>
      ) : (
        <>
          <InstitutionList
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