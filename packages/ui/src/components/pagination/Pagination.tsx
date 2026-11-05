'use client';

import React ,{ useMemo } from 'react';
import { useAppTranslation } from '@fintech/i18n';
import { TIcon } from '@fintech/icons';
import { buildButtonPaginationTheme } from '@fintech/theme';

import { Icon } from '../../primitives'

import { buildVisiblePages ,clampPage } from './business';

type PaginationProps = {
  isLoading?: boolean;
  className?: string;
  ariaLabel?: string;
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  isLoading,
  className,
  ariaLabel,
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {

  const { t } = useAppTranslation();
  const normalizedCurrentPage = clampPage(currentPage, Math.max(totalPages, 1));
  const hasPreviousPage = normalizedCurrentPage > 1;
  const hasNextPage = normalizedCurrentPage < totalPages;

  const visiblePages = useMemo(() => {
    return buildVisiblePages(normalizedCurrentPage, totalPages);
  }, [normalizedCurrentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (isLoading || !onPageChange) {
      return;
    }

    onPageChange(clampPage(page, totalPages));
  };

  const renderPageControl = (page: number, isCurrent: boolean) => {
    const disabled = isCurrent || isLoading;
    const controlClassName = buildButtonPaginationTheme(isCurrent, disabled);
    const pageAriaLabel = t('pagination.goToPage', { page });

    return (
      <button
        type='button'
        className={controlClassName}
        onClick={() => handlePageChange(page)}
        disabled={disabled}
        aria-current={isCurrent ? 'page' : undefined}
        aria-label={pageAriaLabel}
      >
        {page}
      </button>
    );
  }

  const renderNavigationControl = (
    targetPage: number,
    icon: TIcon,
    direction: 'previous' | 'next',
    disabled: boolean,
  ) => {
    const controlClassName = buildButtonPaginationTheme(false, disabled || isLoading);
    const controlAriaLabel = direction === 'previous' ? t('pagination.previous') : t('pagination.next');

    return (
      <button
        type='button'
        className={controlClassName}
        onClick={() => handlePageChange(targetPage)}
        disabled={disabled || isLoading}
        aria-label={controlAriaLabel}
      >
        <Icon icon={icon} className='h-4 w-4' />
      </button>
    );
  };

  return (
    <nav
      className={`flex items-center justify-center ${className}`}
      aria-label={ariaLabel === 'Pagination' ? t('pagination.label') : t(ariaLabel ?? '')}
    >
      <div className='inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm'>
        {renderNavigationControl(normalizedCurrentPage - 1, 'chevron-left', 'previous', !hasPreviousPage)}

        {visiblePages.map((page, index) => {
          const showEllipsis = index > 0 && page - (visiblePages[index - 1] ?? 0) > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis ? <span className='px-1 text-sm text-slate-400'>...</span> : null}
              {renderPageControl(page, page === normalizedCurrentPage)}
            </React.Fragment>
          );
        })}

        {renderNavigationControl(normalizedCurrentPage + 1, 'chevron-right', 'next', !hasNextPage)}
      </div>
    </nav>
  );
};
