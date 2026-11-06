'use client';
import { useEffect, useState } from 'react';

import { Button, Pagination, useModal, Text } from '@fintech/ui';

import { useCreditCards } from '../hooks';
import { CreditCardList, CreditCardForm } from '../components';
import { CreditCard ,TCreditCardPersist } from '@/src/features/credit-card';
import { Delete } from '@/src/components';

type ViewMode = 'list' | 'form';

export default function CreditCardPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useCreditCards();
  const [mode, setMode] = useState<ViewMode>('list');
  const [editingCard, setEditingCard] = useState<CreditCard | undefined>(undefined);

  const handleNewCard = () => {
    setEditingCard(undefined);
    setMode('form');
  }

  const handleEdit = (item: CreditCard) => {
    setEditingCard(item);
    setMode('form');
  }

  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: CreditCard) => {
    openModal({
      title: `card.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const handleSubmit = async (item: TCreditCardPersist) => {
    const response = await persist(item);
    if(response) {
      setMode('list');
      setEditingCard(undefined);
    }
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  if(mode === 'form') {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" className="text-2xl font-bold">{editingCard ? 'card.edit.title' : 'card.create.title'}</Text>
        </div>
        <CreditCardForm
          item={editingCard}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingCard(undefined); }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">card.title</Text>
        <Button onClick={handleNewCard}>card.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground">card.loading</Text>
      ) : (
        <>
          <CreditCardList
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