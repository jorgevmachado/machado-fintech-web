'use client';

import React from 'react';

import { useTranslationResolver } from './resolver';

type LangProps = {
  depth?: number;
  values?: Record<string, unknown>;
  langKey?: string;
  children?: React.ReactNode;
}

export default function Lang({ depth, langKey, values, children }: LangProps) {
  const { resolve, resolveChildren } = useTranslationResolver();

  const defaultValue = typeof children === 'string' ? children : undefined;

  if(langKey) {
    return (
      <>
        {resolve(langKey, {
          ...values,
          ...(defaultValue !== undefined
            ? { defaultValue }
            : {}),
        })}
      </>
    );
  }

  return (
    <>
      {resolveChildren(children, depth)}
    </>
  )
}
