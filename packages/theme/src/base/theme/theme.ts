export const OThemeVariant = ['dark', 'light'] as const;

export type TThemeVariant = (typeof OThemeVariant)[number];