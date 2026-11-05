import React, { useMemo } from 'react';

import type { FormLayoutProps } from './types';

type FormLayoutChildProps = {
  name: string;
};

type FormLayoutChild = React.ReactElement<FormLayoutChildProps>;

type FormLayoutItem = {
  child: FormLayoutChild;
  span: number;
};

export default function FormLayout({
  fields = [],
  cols = 1,
  gap = 1,
  children,
  className,
}: FormLayoutProps) {

  const childrenList = useMemo<FormLayoutChild[]>(
    () =>
      React.Children
      .toArray(children)
      .filter(
        (child): child is FormLayoutChild =>
          React.isValidElement<FormLayoutChildProps>(child) &&
          typeof child.props.name === 'string'
      ),
    [children]
  );

  const layoutFields = useMemo<FormLayoutItem[]>(() => {
    const configuredNames = new Set<string>();

    const configuredFields = fields.filter((field) => {
      if (configuredNames.has(field.name)) {
        return false;
      }

      configuredNames.add(field.name);

      return true;
    });

    const configuredChildren: FormLayoutItem[] = configuredFields
    .map((field) => {
      const child = childrenList.find(
        (child) => child.props.name === field.name
      );

      if (!child) {
        return null;
      }

      return {
        child,
        span: Math.min(field.span ?? 1, cols),
      };
    })
    .filter(
      (item): item is FormLayoutItem => item !== null
    );

    const configuredChildNames = new Set(
      configuredChildren.map(
        (item) => item.child.props.name
      )
    );

    const remainingChildren: FormLayoutItem[] = childrenList
    .filter(
      (child) =>
        !configuredChildNames.has(child.props.name)
    )
    .map((child) => ({
      child,
      span: 1,
    }));

    return [
      ...configuredChildren,
      ...remainingChildren,
    ];
  }, [fields, childrenList, cols]);

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `${gap * 0.25}rem`,
      }}
    >
      {layoutFields.map(({ child, span }) => (
        <div
          key={child.props.name}
          style={{
            gridColumn: `span ${span}`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}