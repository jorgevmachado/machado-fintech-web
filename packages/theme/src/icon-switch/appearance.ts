/**
 * Visual do `IconSwitch`: um trilho neutro com dois ícones e um indicador que
 * desliza para o lado ativo. A troca de estado é só movimento + contraste dos
 * ícones — o trilho nunca muda de cor, para não competir com o conteúdo.
 *
 * O trilho não tem borda: sobre um fundo claro, uma borda fecharia o controle
 * como se fosse um card. A separação vem do contraste entre o trilho e o
 * indicador.
 */
export const ICON_SWITCH_TRACK_CLASS = 'bg-slate-100';

export const ICON_SWITCH_THUMB_CLASS = 'bg-white shadow-sm';

/** Ícone dentro do indicador: estado ativo, contraste cheio. */
export const ICON_SWITCH_ICON_ACTIVE_CLASS = 'text-slate-900';

/** Ícone no trilho, do lado oposto: estado inativo, apagado. */
export const ICON_SWITCH_ICON_INACTIVE_CLASS = 'text-slate-400';