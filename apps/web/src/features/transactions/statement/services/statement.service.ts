import { HttpClient ,Result ,TPaginatedListResponse } from '@fintech/shared';

import { Statement ,TStatementApiData ,TStatementFilter } from '../domain';
import { statementMapper } from '../mappers/statement.mapper';

export class StatementService {
  /**
   * The whole period in a single response: no `page`/`offset` is sent, so the
   * backend answers a plain array instead of a paginated envelope.
   */
  public async fetchList(
    filters: TStatementFilter,
  ): Promise<Result<TPaginatedListResponse<Statement> | Array<Statement>>> {
    const result = await HttpClient.get<
      TPaginatedListResponse<TStatementApiData> | Array<TStatementApiData>
    >({
      path: '/statement',
      baseUrl: '/api',
      config: { params: { ...filters } },
    });

    return statementMapper.mapJsonListResult(result);
  }
}

export const statementService = new StatementService();