'use client';
import { Badge } from '@fintech/ui';
import { Subcategory } from '@/src/features/category';

import ColorIcon from '../color-icon';

type SubcategoryRowProps = {
  subcategory: Subcategory;
}

export default function SubcategoryRow({ subcategory }: SubcategoryRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface-muted,#f1f5f9)] px-3 py-2">
      <span className="w-6 shrink-0 text-xs font-medium text-[color:var(--app-text-muted,#64748b)]">{subcategory.order}.</span>
      <ColorIcon icon={subcategory.icon} color={subcategory.color} label={subcategory.name} />
      <p className="min-w-0 flex-1 truncate text-sm text-[color:var(--app-text,#0f172a)]">{subcategory.name}</p>
      <Badge tone={subcategory.is_active ? 'neutral' : 'danger'} variant="solid" size="lg">
        {subcategory.is_active ? 'category.active' : 'category.inactive'}
      </Badge>
    </li>
  );
}