import type { Result } from '../result';
import type { TCrudList } from '../crud/paginate';
import { Converter } from './converter';
import { mapListResult, mapResult } from './result-mapper';

/**
 * Base para os mappers de feature.
 *
 * Responsabilidade única: delegar a conversão. Quem estende implementa apenas os dois sentidos
 * (`toDomain` e `toJson`); o resto — `parseDate`, `mapEmptyStringsToNull`, normalização e
 * envelopamento em `Result` — vem por herança, sem import extra.
 *
 * Os nomes `mapJsonResult` / `mapJsonListResult` são os mesmos que o `CrudService` espera nos
 * hooks `toMapperEntity` / `toMapperEntityList`.
 */
export abstract class Mapper<TApiData, TDomain> extends Converter {
  /** Converte o payload da API no modelo de domínio. Pode lançar: o `Result` captura. */
  public abstract toDomain(data: TApiData): TDomain;

  /** Converte o modelo de domínio de volta para o payload da API. */
  public abstract toJson(data: TDomain): TApiData;

  /** Normaliza um payload que já está no formato da API (`toJson` de ida e volta). */
  public apiDataToJson(data: TApiData): TApiData {
    return this.toJson(this.toDomain(data));
  }

  /** Converte um item vindo da API. */
  public mapJsonResult(result: Result<TApiData>): Result<TDomain> {
    return mapResult(result, (data) => this.toDomain(data));
  }

  /** Converte uma lista (paginada ou não) vinda da API. */
  public mapJsonListResult(
    result: Result<TCrudList<TApiData>>,
  ): Result<TCrudList<TDomain>> {
    return mapListResult<TApiData, TDomain>(result, (data) => this.toDomain(data));
  }

  /** Normaliza um item que já está no formato da API. */
  public mapApiResult(result: Result<TApiData>): Result<TApiData> {
    return mapResult<TApiData, TApiData>(result, (data) => this.apiDataToJson(data));
  }

  /** Normaliza uma lista (paginada ou não) que já está no formato da API. */
  public mapApiListResult(
    result: Result<TCrudList<TApiData>>,
  ): Result<TCrudList<TApiData>> {
    return mapListResult<TApiData, TApiData>(result, (data) => this.apiDataToJson(data));
  }
}