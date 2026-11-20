export type BuildAccordionThemeResult = {
  root: string;
  item: string;
  content: string;
};

export type BuildAccordionTriggerThemeResult = {
  trigger: string;
  /** O indicador é outro nó DOM: a rotação não pode vazar para o botão. */
  icon: string;
};