'use client';
import { useCallback ,useEffect ,useState } from 'react';
import { Button ,Text ,useModal } from '@fintech/ui';
import {
  TReceiptBatch ,
  TReceiptPersist ,

} from '../domain';
import { useReceipts } from '../hooks';
import { ReceiptForm ,ReceiptUpload } from '../components'

import ReceiptGroups from '../components/groups';
import { useCategories } from '@/src/features/category';
import ReceiptShow from '../components/show';

export default function ReceiptPage() {
  const { modal ,openModal ,closeModal } = useModal();
  const { isLoading ,items ,fetchList ,persist ,confirm, batchUpload } = useReceipts();
  const {
    activeCategories: categories ,
    activeSubcategories: subcategories ,
    fetchList: fetchCategories ,
    isLoading: isLoadingCategories ,
    subcategoryOptions,
  } = useCategories();
  const [mode, setMode] = useState<'list'| 'upload'>('list');
  const [defaultActiveTab, setDefaultActiveTab] = useState<string | undefined>(undefined);

  const openModalForm = (item: TReceiptPersist) => {
    openModal({
      title: 'receipt.edit.title' ,
      children: <ReceiptForm item={ item }
                             subcategoryOptions={ subcategoryOptions }
                             onSubmit={ handleSubmit } onCancel={ closeModal }/>,
    });
  };

  const handleOpenShowModal = (item: TReceiptPersist) => {
    const subcategoryOptionName = subcategoryOptions.find(
      (option) => option.value === item.subcategory_id)?.label ?? '';
    openModal({
      title: 'receipt.show.title' ,
      children: <ReceiptShow item={ item }
                             subcategoryOptionName={ subcategoryOptionName }/>,
    });
  };

  const handleOpenConfirmReceiptModal = useCallback(
    async (item: TReceiptPersist) => {
      openModal({
        title: 'finance.receipt.confirm.title' ,
        children: 'finance.receipt.confirm.message' ,
        footer: {
          primary: {
            children: 'finance.receipt.confirm.action' ,
            onClick: () => {
              confirm(item);
              closeModal();
            },
          } ,
          secondary: {
            children: 'form.action.cancel' ,
            onClick: () => closeModal(),
          },
        },
      });
    } ,[closeModal ,openModal ,confirm]);

  const getDefaultActiveTab = useCallback((total: number, items: TReceiptBatch['items']) => {
    if(items.length === 0){
      return undefined;
    }
    if(total === 1) {
      const [firstItem] = items;
      if (firstItem) {
        return firstItem.status;
      }
    }

    const count = items.reduce<Record<string, number>>((acc, { status }) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const [status] = Object.entries(count).reduce((bigger, current) =>
      current[1] > bigger[1] ? current : bigger
    );

    return status;

  },[]);

  const handleUpload = async (files: Array<File>) => {
    const response = await batchUpload(files);
    if(response) {
      setMode('list');
      const total = response?.total ?? 0;
      const list = response?.items ?? [];
      const status = getDefaultActiveTab(total ?? 0, list);
      setDefaultActiveTab(status);
      return true;
    }
    return false;
  }

  const handleSubmit = async (item: TReceiptPersist) => {
    await persist(item);
    closeModal();
  };

  useEffect(() => {
    void fetchList();
  } ,[fetchList]);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      void fetchCategories();
    }
  } ,[categories ,fetchCategories]);

  const changeMode = () => {
    setMode((prevMode) => (prevMode === 'list' ? 'upload' : 'list'));
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" color="text-[color:var(--app-text-strong,#020617)]" className="text-2xl font-bold">receipt.title</Text>
        <Button onClick={changeMode}>{`receipt.${mode === 'list' ? 'upload' : 'list'}.action`}</Button>
      </div>
      { isLoading || isLoadingCategories ? (
        <Text
          className="text-[color:var(--app-text-muted,#64748b)]">receipt.loading</Text>
      ) : (
        <>
          {
            mode === 'upload' ? (
              <ReceiptUpload onSubmit={ handleUpload }/>
            ) : (
              <>
                { (items.length > 0 && subcategories.length > 0) && (
                  <ReceiptGroups
                    items={ items }
                    subcategories={ subcategories }
                    onEdit={ openModalForm }
                    onShow={ handleOpenShowModal }
                    onConfirm={ handleOpenConfirmReceiptModal }
                    defaultActiveTab={defaultActiveTab}
                  />
                ) }
              </>
            )
          }
        </>
      ) }
      { modal }
    </div>
  );
}