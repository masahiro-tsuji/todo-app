/** biome-ignore-all lint/suspicious/noExplicitAny: axios interceptors use generic request/response shapes */

import { fetchAuthSession } from 'aws-amplify/auth';
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

class AxiosClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}`) {
    this.axiosInstance = axios.create({ baseURL });
    this.axiosInstance.interceptors.request.use(async (config) => {
      // 認証情報の設定
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (idToken) config.headers.Authorization = `Bearer ${idToken}`;
      return config;
    });
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return Promise.resolve(response);
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
  }

  private setHeader = (config: AxiosRequestConfig = {}) => {
    config.headers = { ...config.headers };
    return config;
  };

  public async get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    const customConfig = this.setHeader(config);
    return await this.axiosInstance.get(url, customConfig);
  }
  public async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const customConfig = this.setHeader(config);
    return await this.axiosInstance.post(url, data, customConfig);
  }
  public async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const customConfig = this.setHeader(config);
    return await this.axiosInstance.put(url, data, customConfig);
  }
  public async patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const customConfig = this.setHeader(config);
    return await this.axiosInstance.patch(url, data, customConfig);
  }
  public async delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    const customConfig = this.setHeader(config);
    return await this.axiosInstance.delete(url, customConfig);
  }
}

export const axiosClient = new AxiosClient();
