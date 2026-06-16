export interface ApiResponse<T = unknown> {
  data: T | null;
  message: string;
  error: string | null;
}

export const success = <T>(data: T, message = 'OK'): ApiResponse<T> => ({
  data,
  message,
  error: null,
});

export const failure = (error: string, message = 'Error'): ApiResponse<null> => ({
  data: null,
  message,
  error,
});
