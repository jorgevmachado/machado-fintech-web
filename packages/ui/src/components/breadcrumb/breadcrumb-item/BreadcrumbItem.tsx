'use client';

import { Text } from '../../../primitives';
import { useTranslationResolver } from '../../../lang';

export type TBreadcrumbItem = {
  href: string;
  label: string;
  clickable: boolean;
  isCurrent: boolean;
  onItemClick: (href: string) => void;
}

export default function BreadcrumbItem({ href, label, clickable, isCurrent, onItemClick }: TBreadcrumbItem) {
  const { resolve: resolveTranslation } = useTranslationResolver();

  if(isCurrent) {
    return (
      <Text as="p" className="text-sm text-slate-700 font-semibold" aria-current="page">
        {label}
      </Text>
    );
  }

  if(!clickable) {
    return (
      <Text as="p" className="text-sm text-slate-400 font-normal" aria-current="page">
        {label}
      </Text>
    );
  }

  return (
    <button
      type="button"
      className="cursor-pointer text-sm font-medium text-slate-400 transition hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      onClick={() => onItemClick(href)}
    >
      {resolveTranslation(label)}
    </button>
  )
}
