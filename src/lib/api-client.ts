import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/lib/env";
import type { ApiError } from "@/types";

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.api.baseUrl,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.response.use(
    (res) => res,
    (error: AxiosError<ApiError>) => {
      const message =
        error.response?.data?.message ?? error.message ?? "Unknown error";
      return Promise.reject(new Error(message));
    }
  );

  return client;
}

export const apiClient = createApiClient();
