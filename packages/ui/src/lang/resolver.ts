'use client';

import React ,{ useCallback } from 'react';

import {
  isTranslationValue ,
  isTranslationWithUnquotedParams ,
  parseTranslationMessage ,
  useAppTranslation ,
} from '@fintech/i18n';

type InvalidElement = {
  children?: React.ReactNode;
}

type UseTranslationResolver = {
  resolve<T ,>(value: T ,values?: Record<string ,unknown>): T | string;
  resolveChildren: (child?: React.ReactNode ,currentDepth?: number) => React.ReactNode;
}

export function useTranslationResolver(): UseTranslationResolver {
  const { t } = useAppTranslation();

  const normalizeValue = useCallback(<T ,>(value: T): string | T => {
    if (!isTranslationWithUnquotedParams(value)) {
      return value;
    }

    const match = value.match(
      /^([a-zA-Z0-9]+(?:\.[a-zA-Z0-9_-]+)+),\s*\{([\s\S]*)}$/ ,
    );

    if (!match) {
      return value;
    }

    const [,key ,params] = match;

    if (!key || params === undefined) {
      return value;
    }
    const normalizedParams = params.replace(
      /(\w+)\s*:\s*([^,]+)/g ,
      (_ ,param ,paramValue) => `${ param }: "${ paramValue.trim() }"` ,
    );

    return `"${ key }", {${ normalizedParams }}`;
  } ,[]);

  const resolve = useCallback(<T ,>(value: T ,values?: Record<string ,unknown>): T | string => {
      const normalizedValue = normalizeValue(value);
      if (!isTranslationValue(normalizedValue)) {
        return normalizedValue;
      }

      const translated = parseTranslationMessage(normalizedValue);

      if (!translated) {
        return t(normalizedValue ,values);
      }

      return t(translated.key ,{ ...translated.params ,...values });
    } ,[normalizeValue ,t]);

  const resolveChildren = useCallback(function resolveChild(child?: React.ReactNode ,currentDepth: number = 0 ,values?: Record<string ,unknown>): React.ReactNode {
      if (typeof child === 'string') {
        return resolve(child ,values);
      }

      if (Array.isArray(child)) {
        return child.map(
          (nestedChild) => resolveChild(nestedChild ,currentDepth ,values));
      }

      if (currentDepth <= 0 || !React.isValidElement<InvalidElement>(child)) {
        return child;
      }

      return React.cloneElement(
        child ,
        {} ,
        React.Children.map(
          child.props.children ,
          (nestedChild) => resolveChild(nestedChild ,currentDepth - 1 ,
            values),
        ),
      );
    } ,[resolve]);

  return { resolve ,resolveChildren };
}
