'use client';
import { Subcategory } from '@/src/features/category';
import ColorIcon from '../color-icon';
import { Badge } from '@/src/components';

type SubcategoryRowProps = {
  subcategory: Subcategory;
}

export default function SubcategoryRow({ subcategory }: SubcategoryRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 px-3 py-2">
      <span className="w-6 shrink-0 text-xs font-medium text-muted-foreground">{subcategory.order}.</span>
      <ColorIcon icon={subcategory.icon} color={subcategory.color} label={subcategory.name} />
      <p className="min-w-0 flex-1 truncate text-sm text-foreground">{subcategory.name}</p>
      {!subcategory.is_active ? <Badge variant="secondary">category.inactive</Badge> : null}
    </li>
  );
}