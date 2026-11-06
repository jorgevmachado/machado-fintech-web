
import {
  optionalString ,
  readJsonObject ,
  requiredString ,
  RequestValidationError,
} from '@/src/server/validation/request-validation';
import type {
  TCategoryPersist ,
  TSubCategoryPersist,
} from '@/src/features/category/domain';

function parseSubCategoriesPersistBody(data: unknown ,options: {preserveEmpty?: boolean}): Array<TSubCategoryPersist> {
  if (!Array.isArray(data) || data.length === 0) {
    throw new RequestValidationError('subcategories must be a non-empty array.');
  }

  return data.map((subcategoryValue, index) => {
    if (typeof subcategoryValue !== 'object' || subcategoryValue === null) {
      throw new RequestValidationError(`subcategories[${index}] must be an object.`);
    }

    const id = optionalString(subcategoryValue, 'id');
    const name = requiredString(subcategoryValue, 'name');
    const icon = optionalString(subcategoryValue, 'icon', options);
    const color = optionalString(subcategoryValue, 'color', options);
    const is_active = subcategoryValue['is_active'] === undefined ? true : Boolean(subcategoryValue['is_active']);
    const order = subcategoryValue['order'];
    if (typeof order !== 'number' || !Number.isSafeInteger(order) || order < 1) {
      throw new RequestValidationError(`subcategories[${index}].order must be a positive integer.`);
    }

    return {
      ...(id === undefined ? {} : { id }),
      ...(icon === undefined ? {} : { icon }),
      name,
      ...(color === undefined ? {} : { color }),
      is_active,
      order,
    };
  });
}

export async function parseCategoryPersistBody(
  request: Pick<Request, 'json'>,
  options: { preserveEmpty?: boolean } = {},
): Promise<Omit<TCategoryPersist, 'id'>> {
  const body = await readJsonObject(request);

  const name = requiredString(body, 'name');
  const icon = optionalString(body, 'icon', options);
  const color = optionalString(body, 'color', options);
  const is_active = body['is_active'] === undefined ? true : Boolean(body['is_active']);

  const subcategoriesValue = body['subcategories'];
  const subcategories = parseSubCategoriesPersistBody(subcategoriesValue, options);

  return {
    ...(icon === undefined ? {} : { icon }),
    name,
    ...(color === undefined ? {} : { color }),
    is_active,
    subcategories
  };
}