import { type TTableAlign, TABLE_TEXT_ALIGN_CLASS_MAP, TABLE_CONTENT_ALIGN_CLASS_MAP } from './align';
import {
  TEXT_SIZE_CLASS_MAP ,TRACKING_CLASS_MAP ,WHITESPACE_CLASS_MAP,
  TSize ,TTracking ,
  TWeight ,TWhitespace ,
  WEIGHT_CLASS_MAP ,
} from '../base';

type TTableCellThemeParams = {
  size?: TSize;
  align?: TTableAlign;
  weight?: TWeight;
  tracking?: TTracking;
  className: string;
  whitespace?: TWhitespace;
}

export const tableCellTheme = ({ size = 'xs', align, weight, tracking, className, whitespace }: TTableCellThemeParams): string => {
  const classNameList: Array<string> = [
    'px-4',
    'py-3',
  ];
  classNameList.push(TEXT_SIZE_CLASS_MAP[size]);
  classNameList.push(TABLE_TEXT_ALIGN_CLASS_MAP[align ?? 'left']);
  if(weight) {
    classNameList.push(WEIGHT_CLASS_MAP[weight]);
  }
  if(tracking) {
    classNameList.push(TRACKING_CLASS_MAP[tracking]);
  }
  if(whitespace) {
    classNameList.push(WHITESPACE_CLASS_MAP[whitespace]);
  }
  return [...classNameList, className].join(' ');
}

export const tableCellContentTheme = (align?: TTableAlign): string => {
  const classNameList: Array<string> = [
    'flex',
    'items-center',
    'gap-1',
  ];
  classNameList.push(TABLE_CONTENT_ALIGN_CLASS_MAP[align ?? 'left']);
  return classNameList.join(' ');
}

export const buildTableCellTheme = (type: 'header' | 'body' | 'footer', className: string, align: TTableAlign = 'left'): { cell: string; content: string; } => {
  const tableCellThemeClassName = tableCellTheme({
    size: type !== 'body' ? 'sm' : 'xs',
    align,
    weight: type !== 'body' ? 'semibold' : undefined,
    tracking: type !== 'body' ? 'wide' : undefined,
    whitespace: type === 'body' ? 'nowrap' : undefined,
    className,
  });
  if(type === 'body') {
    return {
      cell: tableCellThemeClassName,
      content: '',
    }
  }
  const tableCellContentThemeClassName = tableCellContentTheme(align);
  return {
    cell: tableCellThemeClassName,
    content: tableCellContentThemeClassName,
  };
};