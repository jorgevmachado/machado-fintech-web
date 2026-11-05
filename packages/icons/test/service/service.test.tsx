import React from 'react';

import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react';

import { getIcon ,ICON_GROUPS } from '../../src';

import * as Groups from '../../src/groups';

describe('Service', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return icon by name without group and dont have in default group', () => {
    const result = getIcon({ name: 'star' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('ci');
  });

  it('should return default icon when icon dont exist', () => {
    const result = getIcon({ name: 'not_exist_icon' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('fa');
  });

  it('should return icon by name without group and have in default group', () => {
    const result = getIcon({ name: 'react' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('fa');
  });

  it('should return icon undefined when group not has icon and withDefault is false', () => {
    const result = getIcon({ name: 'star', group: 'fa', withDefault: false });
    expect(result.icon).toBeUndefined();
    expect(result.group).toBeUndefined();
  });

  it('should return icon of another group when group not has icon and withDefault is true', () => {
    const result = getIcon({ name: 'star', group: 'fa', withDefault: true });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('ci');
  });

  it('should return icon when group has icon', () => {
    const result = getIcon({ name: 'react', group: 'fa' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('fa');
  });

  it('should return icon by name with group', () => {
    const result = getIcon({ name: 'react', group: 'fa' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('fa');
  });

  it('should return icon with custom props a invalid icon is object', () => {
    jest.spyOn(Groups, 'ICON_GROUPS', 'get').mockReturnValue({
      ...Groups.ICON_GROUPS,
      fa: {
        ...Groups.ICON_GROUPS.fa,
        react: {},
      },
    });
    const result = getIcon({ name: 'react', group: 'fa' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('fa');
  });

  it('should return icon with custom props a invalid icon is not object or function', () => {
    jest.spyOn(Groups, 'ICON_GROUPS', 'get').mockReturnValue({
      ...Groups.ICON_GROUPS,
      fa: {
        ...Groups.ICON_GROUPS.fa,
        react: 7,
      },
    });
    const result = getIcon({ name: 'react', group: 'fa' });
    expect(result.icon).toBeTruthy();
    expect(result.group).toBe('fa');
  });

  it('should render the component with custom props (size/tone)', () => {
    const result = getIcon({ name: 'tv', size: 'base', tone: 'primary', group: 'fa' });
    const { container } = render(<>{result.icon}</>);
    expect(container.firstChild).toHaveClass('text-base text-blue-600');
  });

  it('should search in all groups when the icon does not exist in the provided group', () => {
    const result = getIcon({ name: 'react', group: 'vsc' });
    expect(result.icon).toBeTruthy();
    expect(['ci', 'fa', 'fa6', 'gi', 'io', 'io5', 'md', 'vsc']).toContain(result.group);
  });

  it('should render the component with size not found', () => {
    const result = getIcon({ name: 'tv', size: 'down', tone: 'primary', group: 'fa' });
    const { container } = render(<>{result.icon}</>);
    expect(container.firstChild).toHaveClass('text-blue-600');
  });

  it('should render the component with tone not found', () => {
    const result = getIcon({ name: 'tv', size: 'base', tone: 'down', group: 'fa' });
    const { container } = render(<>{result.icon}</>);
    expect(container.firstChild).toHaveClass('text-base');
  });
});