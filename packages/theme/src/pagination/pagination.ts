/**
 * O botão corrente mantém o azul cheio — é o indicador de posição e precisa do
 * mesmo contraste nos dois temas. Os demais vêm de `--app-*` com fallback
 * claro, senão o `bg-white` fixo viraria um bloco claro sobre fundo escuro.
 *
 * O estado `disabled` não emite `hover:*` de cor: sem `tailwind-merge`, um
 * `hover:border` do estado habilitado e outro do desabilitado conviveriam no
 * mesmo elemento e quem venceria seria a ordem do CSS, não a da string.
 */
export const buildButtonPaginationTheme = (isCurrent: boolean = false, disabled: boolean = false): string => {
  const classNameList: Array<string> = [];
  classNameList.push('inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition');
  classNameList.push(
    isCurrent
      ? 'border-[color:var(--app-accent-border,#3b82f6)] bg-blue-600 text-white'
      : 'border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] text-[color:var(--app-text,#0f172a)]'
  );
  classNameList.push(
    disabled
      ? 'cursor-not-allowed opacity-50'
      : isCurrent
        ? 'cursor-pointer'
        : 'cursor-pointer hover:border-[color:var(--app-accent-border,#3b82f6)] hover:text-[color:var(--app-accent,#1d4ed8)]'
  );

  return classNameList.filter(Boolean).join(' ');
};