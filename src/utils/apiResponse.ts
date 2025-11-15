import { Response } from "express";

interface IApiError {
  code: number | string;
  message: string;
  stack?: string;
  details?: any;
}

interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  /**
   * Mengirim respons sukses.
   */
  public static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200,
    meta?: IPaginationMeta
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      error: null,
    });
  }

  /**
   * Mengirim respons error.
   */
  public static error(
    res: Response,
    error: any,
    statusCode: number = 500
  ): Response {
    const apiError: IApiError = {
      code: error.code || statusCode,
      message: error.message || "Internal Server Error",
      stack: error.stack || undefined,
      details: error.details || error.meta || null,
    };

    return res.status(statusCode).json({
      success: false,
      message: apiError.message,
      data: null,
      error: apiError,
    });
  }
}
