import { type AxiosResponse } from "axios";

export const enum REFRESH_TOKEN_ERROR {
  UNAUTHORIZED = "Refresh token unauthorized",
  INVALID_TOKEN = "Auth session not found",
}

export type ResponseStatus = {
  message: string;
  statusCode: number;
};

export type NodeResponse<R> = ResponseStatus & {
  response: R | null;
};

export type ResponseInfinite<T> = {
  pageParams: number[];
  pages?: T[];
};

export type ResponsePaginate<R> = ResponseStatus & {
  pageTotal: number;
  response: R[];
};

export type ParamsPaginate = {
  search?: string;
  page?: number;
  limit?: number;
};

/**
 * @param T - Request properties
 * @param R - Request response
 */

export type ApiRequest<T, R> = (params?: T) => Promise<AxiosResponse<R>>;
export type ApiResponse<R> = Promise<NodeResponse<R>>;
export type ApiResponsePaginate<R> = Promise<ResponsePaginate<R>>;

export const enum EXCEPTION_CODE {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_REQUEST = 400,
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const apiRequest =
  <T, R>(req: ApiRequest<T, R>) =>
  async (params?: T): ApiResponse<R> => {
    try {
      const res = await req(params);

      const { statusCode, message, response } = res.data as NodeResponse<R>;

      return {
        statusCode,
        message,
        response,
      };
    } catch (error: any) {
      const errorResponse = error?.response;
      if (errorResponse?.data) {
        const { data } = errorResponse || {};

        throw new ApiError(
          data?.message || "Network Error! Please try again later.",
        );
      } else {
        throw new ApiError(error || "Network Error! Please try again later.");
      }
    }
  };

export const apiPaginatedRequest =
  <T, R>(req: ApiRequest<T, R>) =>
  async (params?: T): ApiResponsePaginate<R> => {
    try {
      const res = await req(params);
      const { message, statusCode, pageTotal, response } =
        res.data as ResponsePaginate<R>;

      return {
        message,
        statusCode,
        pageTotal,
        response,
      };
    } catch (error: any) {
      const errorResponse = error?.response;
      if (errorResponse) {
        const { message } = errorResponse || {};
        throw new ApiError(message);
      } else {
        throw new ApiError(error);
      }
    }
  };
