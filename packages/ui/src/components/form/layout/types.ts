import React from 'react';

export type FormLayoutItem = {
  name: string;
  span?: number;
};

export type FormLayoutProps = {
  gap?: number;
  cols?: number;
  fields?: Array<FormLayoutItem>;
  children: React.ReactNode;
  className?: string;
};