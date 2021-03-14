import { Middleware, MiddlewareReturn } from './types';

export class MiddlewareDispatcher<T> {

    private middlewares: Middleware<T>[];

    public constructor() {
        this.middlewares = [];
    }

    public hasMiddlewares(): boolean {
        return !!this.middlewares.length;
    }

    public clearMiddlewares(): void {
        this.middlewares = [];
    }

    public use(...middlewares: Middleware<T>[]): void {
        this.middlewares.push(...middlewares);
    }

    public dispatchMiddleware(context: T, ...middlewares: Middleware<T>[]): Promise<MiddlewareReturn> {
        if (!!middlewares.length)
            this.use(...middlewares);

        return this.invokeMiddleware(context, this.middlewares);
    }

    private async invokeMiddleware(context: T, middlewares: Middleware<T>[]): Promise<MiddlewareReturn> {
        if (!middlewares.length) {
            this.clearMiddlewares();

            return;
        }
        
        const [middleware] = middlewares;

        return middleware(context, async () => {
            await this.invokeMiddleware(context, middlewares.slice(1));
        });
    }
    
}