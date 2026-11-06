'use client';
import { useState } from 'react';

import { Button ,Icon ,Lang ,Text, Badge } from '@fintech/ui';

import { Category } from '@/src/features/category';
import ColorIcon from '@/src/features/category/components/list/color-icon';
import SubcategoryRow
  from '@/src/features/category/components/list/subcategory-row';

type CategoryListProps = {
  items: Category[];
  onEdit: (item: Category) => void;
  onDelete: (item: Category) => void;
}

export default function CategoryList({
  items,
  onEdit,
  onDelete
}: CategoryListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  if(items.length === 0) {
    return (
      <div>
        <Lang langKey="category.empty" />
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isExpanded = expandedIds.has(item.id);
        const subcategories = [...item.subcategories].sort((left, right) => left.order - right.order);
        return (
          <li key={item.id} className="rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">

                <Button
                  iconLeft={isExpanded ? "chevron-down" : "chevron-right"}
                  onClick={() => toggleExpanded(item.id)}
                  appearance="iconNoBorder"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                />

                <ColorIcon label={item.name} icon={item.icon} color={item.color} />

                <div className="min-w-0">
                  <Text className="truncate font-medium text-foreground">{item.name}</Text>
                  <Text className="truncate text-sm text-muted-foreground">
                    {`'category.subcategory.counter', {count: ${subcategories.length}}`}
                  </Text>
                </div>

              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={item.is_active ? 'neutral' : 'danger'} variant="solid" size="lg">
                  {item.is_active ? 'category.active' : 'category.inactive'}
                </Badge>
                <Icon icon="edit" onClick={() => onEdit(item)} className="cursor-pointer transition-colors text-amber-700 hover:bg-amber-50" />
                <Icon icon="trash" onClick={() => onDelete(item)} className="cursor-pointer transition-colors text-red-700 hover:bg-red-50" />
              </div>
            </div>

            {isExpanded ? (
              <div className="mt-3 border-t border-border/40 pt-3 pl-12">
                {subcategories.length === 0 ? (
                  <Text className="text-sm text-muted-foreground">category.subcategory.empty</Text>
                ) : (
                  <ul className="space-y-2">
                    {subcategories.map((subcategory) => (
                      <SubcategoryRow key={subcategory.id} subcategory={subcategory} />
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}