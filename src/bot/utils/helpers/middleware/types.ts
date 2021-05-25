export type NextMiddlwareReturn = unknown;

export type NextMiddleware = () => NextMiddlwareReturn;

export type MiddlewareReturn = unknown;

export type Middleware<T> = (context: T, next: NextMiddleware) => MiddlewareReturn;