import type { NextFunction, Request, RequestHandler, Response } from 'express'

// Express 4 doesn't catch rejected promises from async route handlers — an
// unhandled rejection there crashes the whole process, taking every other
// request down with it. Wrapping routes in this forwards the error to
// Express's error-handling middleware instead.
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next)
  }
}
