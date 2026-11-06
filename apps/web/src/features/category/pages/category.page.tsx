'use client';

import { useEffect ,useState } from 'react';

import { Button ,Pagination ,Text ,useModal } from '@fintech/ui';

import { useCategories } from '@/src/features/category/hooks';

import { Category, TCategoryPersist } from '@/src/features/category';
import { Delete } from '@/src/components';
import { CategoryForm ,CategoryList } from '@/src/features/category/components';

type ViewMode = 'list' | 'form';

export default function CategoryPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useCategories();
  const [mode, setMode] = useState<ViewMode>('list');
  const [editingItem, setEditingItem] = useState<Category | undefined>(undefined);

  const handleNew = () => {
    setEditingItem(undefined);
    setMode('form');
  }

  const handleEdit = (item: Category) => {
    setEditingItem(item);
    setMode('form');
  }

  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: Category) => {
    openModal({
      title: `category.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const handleSubmit = async (item: TCategoryPersist) => {
    const response = await persist(item);
    if(response) {
      setMode('list');
      setEditingItem(undefined);
    }
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  if(mode === 'form') {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" className="text-2xl font-bold">{editingItem ? 'category.edit.title' : 'category.create.title'}</Text>
        </div>
        <CategoryForm key={editingItem?.id ?? 'new'} item={editingItem} onSubmit={handleSubmit} onCancel={() => {setMode('list'); setEditingItem(undefined)}}/>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">category.title</Text>
        <Button onClick={handleNew}>category.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground">category.loading</Text>
      ) : (
        <>
          <CategoryList
            items={items}
            onEdit={handleEdit}
            onDelete={openModalDelete}
          />
          {meta && (
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