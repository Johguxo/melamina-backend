import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { failure } from '../types/api-response';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(failure(err.message, 'Application error'));
    return;
  }

  console.error('[UnhandledError]', err);
  res.status(500).json(failure('Internal server error', 'Unexpected error'));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(failure(`Route not found: ${req.method} ${req.originalUrl}`, 'Not found'));
};
