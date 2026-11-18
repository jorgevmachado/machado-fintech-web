'use client';
import { useEffect } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import useAccounts from '@/src/features/account/hooks/use-accounts';
import { Account ,TAccountPersist } from '@/src/features/account/domain';
import { Delete } from '@/src/components';

import { AccountForm ,AccountList } from '@/src/features/account/components';


export default function AccountPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useAccounts();


  const handleDelete = async (identifier: string) => {
    await remove(identifier);
    closeModal();
  }

  const openModalDelete = (item: Account) => {
    openModal({
      title: `account.delete.confirm, {name: ${item.name}}`,
      children: <Delete identifier={item.id} onClose={closeModal} onSubmit={handleDelete} />,
    });
  }

  const openModalForm = (item?: Account) => {
    openModal({
      title: item?.id ? `account.edit.title, {name: ${item.name}}` : 'account.create.title',
      children: <AccountForm key={item?.id ?? 'new'} item={item} onSubmit={handleSubmit} onCancel={closeModal} />,
    });
  }

  const handleSubmit = async (item: TAccountPersist) => {
     await persist(item);
     closeModal();
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" color="text-[color:var(--app-text-strong,#020617)]" className="text-2xl font-bold">account.title</Text>
        <Button onClick={() => openModalForm()}>account.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-[color:var(--app-text-muted,#64748b)]">account.loading</Text>
      ) : (
        <>
          <AccountList
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