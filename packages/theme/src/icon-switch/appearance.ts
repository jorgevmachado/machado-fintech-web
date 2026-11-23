/**
 * Visual do `IconSwitch`: um trilho neutro com dois ícones e um indicador que
 * desliza para o lado ativo. A troca de estado é só movimento + contraste dos
 * ícones — o trilho nunca muda de cor, para não competir com o conteúdo.
 *
 * O trilho não tem borda: sobre um fundo claro, uma borda fecharia o controle
 * como se fosse um card. A separação vem do contraste entre o trilho e o
 * indicador.
 *
 * Trilho e ícones vêm de `--app-*` (fallback claro), então o controle acompanha
 * o tema. O indicador continua branco nos dois temas de propósito: ele precisa
 * contrastar com o trilho, não com a página — no escuro um trilho escuro com
 * thumb branco é exatamente o padrão de um switch de sistema.
 *
 * O trilho usa `--app-track`, não `--app-surface-muted`: no claro, uma
 * superfície quase branca deixaria o indicador branco invisível. O trilho
 * precisa ser um tom médio nos dois temas para o thumb sempre se destacar.
 */
export const ICON_SWITCH_TRACK_CLASS = 'bg-[color:var(--app-track,#cbd5e1)]';

export const ICON_SWITCH_THUMB_CLASS = 'bg-white shadow-sm';

/**
 * Ícone dentro do indicador: estado ativo, contraste cheio.
 *
 * Cor escura fixa, **não** `--app-text-strong`: o ícone fica sobre o thumb, que
 * é branco nos dois temas. No escuro `--app-text-strong` é `#f8fafc` e o ícone
 * branco sobre branco fica invisível (1.05:1). O contraste aqui é com o thumb,
 * não com a página.
 */
export const ICON_SWITCH_ICON_ACTIVE_CLASS = 'text-slate-900';

/** Ícone no trilho, do lado oposto: estado inativo, apagado. */
export const ICON_SWITCH_ICON_INACTIVE_CLASS = 'text-[color:var(--app-text-muted,#64748b)]';