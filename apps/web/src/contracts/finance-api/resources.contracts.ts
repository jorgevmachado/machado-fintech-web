export type TTimestampedApiResource = {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string | null;
};

export type PayerApiData = TTimestampedApiResource;
export type BeneficiaryApiData = TTimestampedApiResource;
export type InstitutionApiData = TTimestampedApiResource;
export type CategoryApiData = TTimestampedApiResource & {
  description?: string;
};
