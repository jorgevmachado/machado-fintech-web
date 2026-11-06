'use client';
import { useEffect ,useState } from 'react';
import { Button ,Pagination ,useModal, Text } from '@fintech/ui';
import useAccounts from '@/src/features/account/hooks/use-accounts';
import { Account ,TAccountPersist } from '@/src/features/account/domain';
import { Delete } from '@/src/components';

import { AccountForm ,AccountList } from '@/src/features/account/components';

type ViewMode = 'list' | 'form';

export default function AccountPage() {
  const { modal, openModal, closeModal } = useModal();
  const { meta, isLoading, items, fetchList, persist, goToPage, remove } = useAccounts();
  const [mode, setMode] = useState<ViewMode>('list');
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(undefined);

  const handleNew = () => {
    setEditingAccount(undefined);
    setMode('form');
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setMode('form');
  }

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

  const handleSubmit = async (item: TAccountPersist) => {
    const response = await persist(item);
    if(response) {
      setMode('list');
      setEditingAccount(undefined);
    }
  }

  useEffect(() => {
    void fetchList({ page: '1' });
  }, [fetchList]);

  if(mode === 'form') {
    return (
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" className="text-2xl font-bold">{editingAccount ? 'account.edit.title' : 'account.create.title'}</Text>
        </div>
        <AccountForm
          item={editingAccount}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingAccount(undefined); }}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" className="text-2xl font-bold">account.title</Text>
        <Button onClick={handleNew}>account.create.title</Button>
      </div>
      {isLoading ? (
        <Text className="text-muted-foreground">account.loading</Text>
      ) : (
        <>
          <AccountList
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