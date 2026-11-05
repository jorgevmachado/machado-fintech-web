export const CreditCardBrandsMap = {
  VISA: "VISA",
  MASTERCARD: "MASTERCARD",
  ELO: "ELO",
  AMEX: "AMEX",
  HIPERCARD: "HIPERCARD",
  DINERS: "DINERS",
  OTHER: "OTHER",
} as const;

export type CreditCardBrandsEnum = typeof CreditCardBrandsMap[keyof typeof CreditCardBrandsMap];