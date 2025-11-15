import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  return ApiResponse.error(
    res,
    {
      code: statusCode,
      message: err.message || "Internal Server Error",
      details: err.details || null,
    },
    statusCode
  );
};
