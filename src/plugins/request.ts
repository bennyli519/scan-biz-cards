/* eslint-disable no-implicit-coercion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Toast } from 'antd-mobile';
import axios, { type AxiosRequestConfig } from 'axios';

import { getAuth, setAuth } from './../utils/index';

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';
axios.defaults.timeout = 1000 * 10;
type AxiosErrorInterface = {
  message: string;
  config: any;
  response: any;
};

axios.interceptors.request.use(
  (config: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  (error: AxiosErrorInterface) => {
    return error;
  },
);

axios.interceptors.response.use(
  async (response: any) => {
    if (response.status !== 200 && response.status !== 201) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      response.data.message &&
        Toast.show({ icon: 'fail', content: response.data.message });
      return Promise.reject(response);
    }

    console.log('respone', response);
    return Promise.resolve(response.data.data);
  },
  async (error: AxiosErrorInterface) => {
    if (~`${error.message}`.indexOf('timeout')) {
      Toast.show({ icon: 'fail', content: '网络超时' });
    }

    error.response &&
      error.response.data.message &&
      Toast.show({ icon: 'fail', content: error.response.data.message });
    if (error.response && error.response.status === 401) {
      setAuth('');
      window.location.assign(`${window.location.origin}/login`);
    } else {
      error.response &&
        error.response.statusText &&
        Toast.show({ icon: 'fail', content: error.response.data.message });
    }

    return Promise.reject(error);
  },
);

const baseRequest = async (config: any): Promise<any> => {
  config = {
    ...config,
    headers: {
      Authorization: `Bearer ${getAuth()}`,
    },
    url: `${import.meta.env.VITE_HTTP_API}${config.url}`,
  };
  return axios.request(config);
};

export const get = async (
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
) =>
  baseRequest({
    method: 'get',
    params,
    url,
    ...config,
  });
export const post = async (
  url: string,
  data: Record<string, unknown>,
  config?: AxiosRequestConfig,
) => {
  return baseRequest({
    data,
    method: 'post',
    url,
    ...config,
  });
};

export const patch = async (
  url: string,
  data: Record<string, unknown>,
  config?: AxiosRequestConfig,
) => {
  return baseRequest({
    data,
    method: 'patch',
    url,
    ...config,
  });
};

export const put = async (
  url: string,
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig,
) => {
  return baseRequest({
    data,
    method: 'put',
    url,
    ...config,
  });
};

export const remove = async (
  url: string,
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig,
) => {
  return baseRequest({
    data,
    method: 'delete',
    url,
    ...config,
  });
};
