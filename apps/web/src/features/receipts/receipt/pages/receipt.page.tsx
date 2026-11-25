'use client';
import { useCallback ,useEffect ,useState } from 'react';
import { Button ,Text ,useAlert ,useModal } from '@fintech/ui';
import {
  TReceiptBatch ,
  TReceiptConfirm ,
  TReceiptPersist ,
} from '../domain';
import { useReceipts ,useReceiptsOptions } from '../hooks';
import { ReceiptForm ,ReceiptUpload } from '../components'

import ReceiptGroups from '../components/groups';
import ReceiptShow from '../components/show';
import ReceiptConfirm from '../components/confirm';

export default function ReceiptPage() {
  const { modal ,openModal ,closeModal } = useModal();
  const { showAlert } = useAlert();
  const { isLoading ,items ,fetchList ,persist ,confirm, batchUpload } = useReceipts();
  const { accountsOptions, creditCardsOptions, subcategoriesOptions, subcategories, isLoading: isLoadingOptions } = useReceiptsOptions();


  const [mode, setMode] = useState<'list'| 'upload'>('list');
  const [defaultActiveTab, setDefaultActiveTab] = useState<string | undefined>(undefined);

  const openModalForm = (item: TReceiptPersist) => {
    openModal({
      title: 'receipt.edit.title' ,
      children: <ReceiptForm item={ item }
                             subcategoryOptions={ subcategoriesOptions }
                             onSubmit={ handleSubmit } onCancel={ closeModal }/>,
    });
  };

  const handleOpenShowModal = (item: TReceiptPersist) => {
    const subcategoryOptionName = subcategoriesOptions.find(
      (option) => option.value === item.subcategory_id)?.label ?? '';
    openModal({
      title: 'receipt.show.title' ,
      children: <ReceiptShow item={ item }
                             subcategoryOptionName={ subcategoryOptionName }/>,
    });
  };

  /** Reenvia com consentimento explícito; só fecha o modal se a API aceitar. */
  const resubmitWithOverwrite = useCallback(async (payload: TReceiptConfirm) => {
    const outcome = await confirm({ ...payload, overwrite: true });

    if (outcome.status === 'confirmed') {
      closeModal();
    }
  }, [closeModal, confirm]);

  /**
   * Confirma e decide o próximo passo pelo desfecho: sucesso fecha o modal;
   * conflito de ocorrência pede consentimento para sobrescrever; qualquer outro
   * desfecho mantém o modal aberto para o usuário ajustar e tentar de novo.
   */
  const submitConfirm = useCallback(async (payload: TReceiptConfirm) => {
    const outcome = await confirm(payload);

    if (outcome.status === 'confirmed') {
      closeModal();
      return;
    }

    if (outcome.status === 'conflict' && outcome.conflict.type === 'OCCURRENCE_EXISTS') {
      openModal({
        title: 'receipt.confirm.conflict.title',
        children: 'receipt.confirm.conflict.message',
        footer: {
          primary: {
            children: 'receipt.confirm.conflict.overwrite',
            onClick: () => { void resubmitWithOverwrite(payload); },
          },
          secondary: {
            children: 'receipt.confirm.conflict.keep',
            onClick: closeModal,
          },
        },
      });
      return;
    }

    if (outcome.status === 'conflict') {
      // `RECEIPT_ALREADY_PROCESSED` não é sobrescrevível: o hook não alerta conflito,
      // então a mensagem precisa sair daqui.
      showAlert({
        variant: 'error',
        message: 'receipt.confirm.conflict.processed',
        position: 'top-right',
      });
    }
  }, [closeModal, confirm, openModal, resubmitWithOverwrite, showAlert]);

  const handleOpenConfirmReceiptModal = useCallback(
    (item: TReceiptPersist) => {
      openModal({
        title: 'receipt.confirm.title',
        children: <ReceiptConfirm item={item} onSubmit={submitConfirm} accountsOptions={accountsOptions} onCancel={closeModal} subcategoryOptions={subcategoriesOptions} creditCardsOptions={creditCardsOptions}/>
      })
    } ,[accountsOptions, closeModal, openModal, subcategoriesOptions, submitConfirm, creditCardsOptions]);

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

  const changeMode = () => {
    setMode((prevMode) => (prevMode === 'list' ? 'upload' : 'list'));
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <Text as="h1" color="text-[color:var(--app-text-strong,#020617)]" className="text-2xl font-bold">receipt.title</Text>
        <Button onClick={changeMode}>{`receipt.${mode === 'list' ? 'upload' : 'list'}.action`}</Button>
      </div>
      { isLoading || isLoadingOptions ? (
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