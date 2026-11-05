import {
  LOADING_BAR_SIZE_CLASS_MAP ,
  LOADING_CIRCLE_SIZE_CLASS_MAP ,
  LOADING_DOT_CLASS_MAP ,
  LOADING_DOTS_SIZE_CLASS_MAP ,
  type TReducedSize ,
} from '../../src';

describe('size' ,() => {
  it('should map size values to class names' ,() => {
    (Object.keys(LOADING_CIRCLE_SIZE_CLASS_MAP) as TReducedSize[]).forEach(
      (size) => {
        if(size === 'sm') {
          expect(LOADING_CIRCLE_SIZE_CLASS_MAP[size]).toBe('size-4 border-2');
        }
        if(size === 'md') {
          expect(LOADING_CIRCLE_SIZE_CLASS_MAP[size]).toBe('size-6 border-2');
        }
        if(size === 'lg') {
          expect(LOADING_CIRCLE_SIZE_CLASS_MAP[size]).toBe('size-10 border-4');
        }
      });
    (Object.keys(LOADING_DOTS_SIZE_CLASS_MAP) as TReducedSize[]).forEach(
      (size) => {
        if (size === 'sm') {
          expect(LOADING_DOTS_SIZE_CLASS_MAP[size]).toBe('size-1.5');
        }
        if (size === 'md') {
          expect(LOADING_DOTS_SIZE_CLASS_MAP[size]).toBe('size-2');
        }
        if (size === 'lg') {
          expect(LOADING_DOTS_SIZE_CLASS_MAP[size]).toBe('size-3');
        }
      });

    (Object.keys(LOADING_BAR_SIZE_CLASS_MAP) as TReducedSize[]).forEach(
      (size) => {
        if (size === 'sm') {
          expect(LOADING_BAR_SIZE_CLASS_MAP[size]).toBe('h-0.5');
        }
        if (size === 'md') {
          expect(LOADING_BAR_SIZE_CLASS_MAP[size]).toBe('h-1');
        }
        if (size === 'lg') {
          expect(LOADING_BAR_SIZE_CLASS_MAP[size]).toBe('h-2');
        }
      });
  });
});

describe('dot', () => {
  it('should map dot class map', () => {
    expect(LOADING_DOT_CLASS_MAP).toBe('rounded-full bg-current animate-loading-dot');
  })
})
