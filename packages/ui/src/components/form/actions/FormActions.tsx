'use client';

import React, { useMemo } from 'react';

import { JUSTIFY_CLASS_MAP } from '@fintech/theme';

import { useTranslationResolver } from '../../../lang';

import Button from '../../button';

import type { FormActionsProps } from './types';

export default function FormActions ({
  cancel,
  submit,
  justify = 'between',
  className
}: FormActionsProps) {
  const { resolveChildren: resolveTranslation } = useTranslationResolver();

  const formActionClassName = useMemo(() => {
    const classNameList = [
      'flex',
      'flex-row',
      'gap-1',
      JUSTIFY_CLASS_MAP[justify],
    ]
    if(className) {
      classNameList.push(className);
    }
    return classNameList.filter(Boolean).join(' ');
  }, [justify, className]);

  const formSubmit = useMemo(() => {
    if(submit.children){
      return {
        ...submit,
        children: resolveTranslation(submit?.children)
      }
    }
    return submit;
  }, [submit, resolveTranslation]);

  const formCancel = useMemo(() => {
    if(!cancel){
      return;
    }
    const currentCancel = {
      ...cancel,
      tone: cancel?.tone ?? 'danger'
    }
    if(currentCancel.children){
      return {
        ...currentCancel,
        children: resolveTranslation(currentCancel?.children)
      }
    }
    return currentCancel;
  }, [cancel, resolveTranslation]);

  return (
    <div className={formActionClassName}>
      {formCancel && <Button {...formCancel} tone={cancel?.tone ?? 'danger'} type="button"/>}
      <Button {...formSubmit} type="submit"/>
    </div>
  );
};
