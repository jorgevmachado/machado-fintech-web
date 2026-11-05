export type TUserStatus = 'ACTIVE' | 'INACTIVE';
export type TUserRole = 'USER' | 'ADMIN';

export type TUserInfo = {
  total: number;
  total_success: number;
  total_failures: number;
  failed_attempts: number;
  last_authentication_at?: Date;
};

export type TUser = {
  id: string;
  role: TUserRole;
  name: string;
  info?: TUserInfo;
  email: string;
  status: TUserStatus;
  username: string;
  created_at: string;
};
