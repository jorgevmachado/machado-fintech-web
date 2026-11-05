import { describe, expect, it } from '@jest/globals';

import {
  buildVisiblePages,
  clampPage,
} from '../../../src/components/pagination';


describe('clampPage', () => {

  it('should return the same page when page is inside valid range', () => {
    expect(
      clampPage(3, 10),
    ).toBe(3);
  });


  it('should return 1 when page is lower than minimum', () => {
    expect(
      clampPage(0, 10),
    ).toBe(1);
  });


  it('should return 1 when page is negative', () => {
    expect(
      clampPage(-5, 10),
    ).toBe(1);
  });


  it('should return totalPages when page is greater than totalPages', () => {
    expect(
      clampPage(20, 10),
    ).toBe(10);
  });


  it('should return 1 when totalPages is zero', () => {
    expect(
      clampPage(5, 0),
    ).toBe(1);
  });


  it('should return 1 when totalPages is negative', () => {
    expect(
      clampPage(5, -10),
    ).toBe(1);
  });

});


describe('buildVisiblePages', () => {

  it('should return all pages when totalPages is lower than max visible pages', () => {
    expect(
      buildVisiblePages(2, 5),
    )
    .toEqual([
      1,
      2,
      3,
      4,
      5,
    ]);
  });


  it('should return all pages when totalPages equals max visible pages', () => {
    expect(
      buildVisiblePages(3, 5),
    )
    .toEqual([
      1,
      2,
      3,
      4,
      5,
    ]);
  });


  it('should render first pages with ellipsis scenario when current page is near beginning', () => {
    expect(
      buildVisiblePages(2, 10),
    )
    .toEqual([
      1,
      2,
      3,
      4,
      10,
    ]);
  });


  it('should render last pages with ellipsis scenario when current page is near end', () => {
    expect(
      buildVisiblePages(9, 10),
    )
    .toEqual([
      1,
      7,
      8,
      9,
      10,
    ]);
  });


  it('should render middle pages with siblings', () => {
    expect(
      buildVisiblePages(5, 10),
    )
    .toEqual([
      1,
      4,
      5,
      6,
      10,
    ]);
  });


  it('should respect custom max visible pages', () => {
    expect(
      buildVisiblePages(3, 8, 3),
    )
    .toEqual([
      1,
      2,
      3,
      4,
      8,
    ]);
  });


  it('should handle first page correctly with many pages', () => {
    expect(
      buildVisiblePages(1, 20),
    )
    .toEqual([
      1,
      2,
      3,
      4,
      20,
    ]);
  });


  it('should handle last page correctly with many pages', () => {
    expect(
      buildVisiblePages(20, 20),
    )
    .toEqual([
      1,
      17,
      18,
      19,
      20,
    ]);
  });


  it('should handle middle page correctly with many pages', () => {
    expect(
      buildVisiblePages(10, 20),
    )
    .toEqual([
      1,
      9,
      10,
      11,
      20,
    ]);
  });

});