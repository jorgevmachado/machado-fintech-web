'use client';

import { useEffect } from 'react';

import { Button ,Pagination ,Text ,useModal } from '@fintech/ui';

import { useCategories } from '@/src/features/category/hooks';

import { Category, TCategoryPersist } from '@/src/features/category';
import { Delete } from '@/src/components';
import { CategoryForm ,CategoryList } from '@/src/features/category/components';

export default function CategoryPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useCategories();

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

  const openModalForm = (item?: Category) => {
    openModal({
      title: item?.id ? `category.edit.title, {name: ${item.name}}` : 'category.create.title',
      children: <CategoryForm key={item?.id ?? 'new'} item={item} onSubmit={handleSubmit} onCancel={closeModal} />,
    });
  }

  const handleSubmit = async (item: TCategoryPersist) => {
    await persist(item);
    closeModal();
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" color="text-[color:var(--app-text-strong,#020617)]" className="text-2xl font-bold">category.title</Text>
        <Button onClick={() => openModalForm()} iconLeft="plus">category.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-[color:var(--app-text-muted,#64748b)]">category.loading</Text>
      ) : (
        <>
          <CategoryList
            items={items}
            onEdit={openModalForm}
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