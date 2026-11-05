import { renderHook } from '@testing-library/react';

import {
  useBreadcrumb,
  BreadcrumbProvider,
} from '../../../src';
import React from 'react';

describe('useBreadcrumb', () => {

  it('should throw when used outside BreadcrumbProvider', () => {

    expect(() =>
      renderHook(() =>
        useBreadcrumb({
          pathname: '/home/accounts',
        })
      )
    ).toThrow(
      'useBreadcrumb must be used within a BreadcrumbProvider'
    );

  });


  it('should return breadcrumbs', () => {

    const wrapper = ({
      children,
    }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );


    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/home/accounts/edit',
        }),
      { wrapper }
    );


    expect(result.current.breadcrumbs).toEqual([
      {
        href: '/home',
        label: 'Home',
        clickable: true,
        isCurrent: false,
      },
      {
        href: '/home/accounts',
        label: 'Accounts',
        clickable: true,
        isCurrent: false,
      },
      {
        href: '/home/accounts/edit',
        label: 'Edit',
        clickable: true,
        isCurrent: true,
      },
    ]);

  });


  it('should prepend custom home segment', () => {

    const wrapper = ({
      children,
    }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );


    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/accounts/edit',
          homeSegment: 'dashboard',
        }),
      { wrapper }
    );


    expect(result.current.breadcrumbs[0]).toEqual({
      href: '/dashboard',
      label: 'dashboard',
      clickable: true,
      isCurrent: false,
    });

  });


  it('should mark blocked paths as not clickable', () => {

    const wrapper = ({
      children,
    }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );


    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/home/accounts/edit',
          blockedPaths: ['accounts'],
        }),
      { wrapper }
    );


    expect(result.current.breadcrumbs[1].clickable)
    .toBeFalsy();

  });


  it('should override default route labels', () => {

    const wrapper = ({
      children,
    }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );


    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/home/profile',
          routeSegmentLabels: {
            profile: 'Meu Perfil',
          },
        }),
      { wrapper }
    );


    expect(result.current.breadcrumbs[1].label)
    .toBe('Meu Perfil');

  });


  it('should use default route labels', () => {

    const wrapper = ({
      children,
    }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );


    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/home/register-user',
        }),
      { wrapper }
    );


    expect(result.current.breadcrumbs[1].label)
    .toBe('Register User');

  });

  it('should return empty breadcrumbs when pathname is empty', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );

    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/',
        }),
      { wrapper }
    );

    expect(result.current.breadcrumbs).toEqual([]);
  });

  it('should return empty breadcrumbs when pathname is only the home segment', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <BreadcrumbProvider>
        {children}
      </BreadcrumbProvider>
    );

    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/home',
        }),
      { wrapper }
    );

    expect(result.current.breadcrumbs).toEqual([]);
  });

  it('should return empty breadcrumbs when pathname matches the custom home segment', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <BreadcrumbProvider home="dashboard">
        {children}
      </BreadcrumbProvider>
    );

    const { result } = renderHook(
      () =>
        useBreadcrumb({
          pathname: '/dashboard',
        }),
      { wrapper }
    );

    expect(result.current.breadcrumbs).toEqual([]);
  });

});