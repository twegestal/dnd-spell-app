export type ErrorResponse = {
  message: string;
  status?: number;
  stack?: string;
};

export type SbError = { code?: string; message?: string } | null | undefined;
