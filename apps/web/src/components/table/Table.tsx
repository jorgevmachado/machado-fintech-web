/* eslint-disable react/prop-types -- the components are typed by TypeScript; the rule cannot read `forwardRef` generics. */
import * as React from 'react';
import { cn } from '@/src/shared/temp-class-name';


const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn(['w-full caption-bottom text-sm', className ?? ''])} {...props} />
    </div>
  ),
);
Table.displayName = 'Table';

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn(['[&_tr]:border-b [&_tr]:border-[color:var(--app-border,#e2e8f0)]', className ?? ''])} {...props} />,
);
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn(['[&_tr:last-child]:border-0', className ?? ''])} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(['border-b border-[color:var(--app-border,#e2e8f0)] transition-colors hover:bg-[color:var(--app-surface-hover,rgba(241,245,249,0.7))] data-[state=selected]:bg-[color:var(--app-surface-muted,#f1f5f9)]', className ?? ''])}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(['h-10 px-2 text-left align-middle font-medium text-[color:var(--app-text-muted,#64748b)]', className ?? ''])}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn(['p-2 align-middle', className ?? ''])} {...props} />,
);
TableCell.displayName = 'TableCell';

export { Table, TableBody, TableCell,TableHead, TableHeader, TableRow };
