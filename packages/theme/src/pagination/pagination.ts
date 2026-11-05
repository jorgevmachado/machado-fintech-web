export const buildButtonPaginationTheme = (isCurrent: boolean = false, disabled: boolean = false): string => {
  const classNameList: Array<string> = [];
  classNameList.push('inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition');
  classNameList.push(
    isCurrent
      ? 'border-blue-600 bg-blue-600 text-white'
      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
  );
  classNameList.push(
    disabled ? 'cursor-not-allowed opacity-50 hover:border-slate-200 hover:text-slate-700' : 'cursor-pointer'
  )

  return classNameList.filter(Boolean).join(' ');
};