import { post } from '@/plugins/request';

export type RegisterParams = {
  visitorId?: string | undefined;
  email: string;
  code: string;
};

export type LoginParams = {
  visitorId?: string | undefined;
  email: string;
  code: string;
};

export const getList = async () => post('transportation/route/list', {});

export const sendEmail = async (email: string) =>
  post('/user/send-verification-code', {
    email,
  });

export const register = async (params: RegisterParams) => post('/user', params);

export const login = async (params: LoginParams) => post('/user/login', params);
