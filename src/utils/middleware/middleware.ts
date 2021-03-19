import { Middleware, MiddlewareReturn } from './types';

/**
 * Main MiddlewareDispatcher class
 */
export class MiddlewareDispatcher<T> {

    /**
     * List of all middlewares
     */
    private middlewares: Middleware<T>[];

    /**
     * Constructor
     */
    public constructor() {
        this.middlewares = [];
    }

    /**
     * Checks if there are middlwares
     */
    public get hasMiddlewares(): boolean {
        return !!this.middlewares.length;
    }

    /**
     * Clears all list of middlewares
     */
    public clearMiddlewares(): void {
        this.middlewares = [];
    }

    /**
     * Adds middlewares
     */
    public use(...middlewares: Middleware<T>[]): void {
        this.middlewares.push(...middlewares);
    }

    /**
     * Calls up the middlewares chain
     */
    public dispatchMiddleware(context: T, ...middlewares: Middleware<T>[]): Promise<MiddlewareReturn> {
        if (!!middlewares.length)
            this.use(...middlewares);

        return this.invokeMiddleware(context, this.middlewares);
    }

	/**
	 * Returns custom tag
	 */
     public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

    /**
     * Calls up middlewares chain worker
     */
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