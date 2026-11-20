// Importado do módulo folha (não do barrel `../../base`): `date.vo` importa o barrel, e passar
// por ele aqui fecharia um ciclo de módulos em tempo de carga.
import { DateFormat } from '../../value-object/date/format';

const defaultDateParser = (value: string): Date | undefined =>
  new DateFormat().dateTimeStringToDate(value);

/** Troca strings vazias por `null`, preservando os demais valores. */
export type TEmptyStringsToNull<T extends object> = {
  [K in keyof T]: Exclude<T[K], ''> | ('' extends T[K] ? null : never);
};

/**
 * Converte um timestamp da API em `Date`.
 *
 * Lança quando o valor é inválido; chamado de dentro de um `toDomain`, a exceção vira
 * `Result.fail` no `mapJsonResult`.
 */
export function parseDate(
  value: string,
  field: string,
  resource: string,
  parser: (value: string) => Date | undefined = defaultDateParser,
): Date {
  const date = parser(value);
  if (!date) {
    throw new Error(`Invalid ${resource} ${field}: ${value}`);
  }

  return date;
}

/**
 * Converte um decimal da API em `number`.
 *
 * O backend declara os valores monetários como `Decimal`, e o Pydantic serializa
 * `Decimal` como string no JSON — então a resposta traz `"1850.00"` onde o
 * domínio espera `1850`. Aceita os dois formatos para não quebrar quando um
 * endpoint passar a mandar número. Lança quando o valor é inválido; chamado de
 * dentro de um `toDomain`, a exceção vira `Result.fail` no `mapJsonResult`.
 *
 * Não use `Money` aqui: ele interpreta a string como centavos digitados, não
 * como um decimal já formatado.
 */
export function parseDecimal(
  value: number | string,
  field: string,
  resource: string,
): number {
  const parsed = typeof value === 'number' ? value : Number(value.trim());

  if (typeof value === 'string' && !value.trim()) {
    throw new Error(`Invalid ${resource} ${field}: empty value`);
  }

  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${resource} ${field}: ${value}`);
  }

  return parsed;
}

/** Troca strings vazias por `null` antes de enviar o payload. */
export function mapEmptyStringsToNull<T extends object>(data: T): TEmptyStringsToNull<T> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === '' ? null : value]),
  ) as TEmptyStringsToNull<T>;
}

/**
 * Helpers de conversão compartilhados por `Mapper` e `CrudService`.
 *
 * Expostos como métodos protegidos para que quem estende já os tenha por herança, sem import
 * avulso. As funções livres acima continuam exportadas para os mappers que ainda não migraram.
 */
export abstract class Converter {
  protected parseDate(
    value: string,
    field: string,
    resource: string,
    parser?: (value: string) => Date | undefined,
  ): Date {
    return parseDate(value, field, resource, parser);
  }

  protected mapEmptyStringsToNull<T extends object>(data: T): TEmptyStringsToNull<T> {
    return mapEmptyStringsToNull(data);
  }
}