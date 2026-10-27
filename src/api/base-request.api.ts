import axios, {
  type CreateAxiosDefaults,
  // type CancelToken,
  // type CancelTokenSource,
  type AxiosResponse,
} from "axios";
import config from "@/utils/config";
import { REFRESH_TOKEN_ERROR } from "./axios.api";

let axiosInstance: ReturnType<typeof axios.create> | null = null;

export const httpRequest = (props?: CreateAxiosDefaults) => {
  if (!axiosInstance) {
    // const activeSources = new Map<CancelToken, CancelTokenSource>();

    axiosInstance = axios.create({
      baseURL: config.baseUrl,
      withCredentials: true,
      ...props,
    });

    // request.interceptors.request.use(async config => {
    //   const source = axios.CancelToken.source();
    //   activeSources.set(source.token, source);

    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    //   return config;
    // });

    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          try {
            const refreshResponse = await axios.post(
              `${config.baseUrl}${config.refreshToken}`,
              {},
              { withCredentials: true },
            );
            const newAccessToken = refreshResponse.data.response;

            if (!newAccessToken) {
              throw new Error("No new token in refresh response");
            } else {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              originalRequest._retry = true;
              return axiosInstance?.(originalRequest);
            }
          } catch (catchError) {
            return Promise.reject(
              REFRESH_TOKEN_ERROR.UNAUTHORIZED || catchError,
            );
          }
        }

        return Promise.reject(error);
      },
    );
  }

  return axiosInstance;
};
