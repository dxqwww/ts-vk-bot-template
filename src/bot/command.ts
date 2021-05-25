import { ContextDefaultState } from "vk-io";

import { Module } from "@Main/module";

import { Middleware, MiddlewareDispatcher, MiddlewareReturn } from '@Main/utils/helpers';
import { ICustomMessageContext } from "@Main/types";

export type CommandHearCondition<S = ContextDefaultState, P = {}> = Middleware<ICustomMessageContext<S, P>> | RegExp;
export type CommandCallback<S = ContextDefaultState, P = {}> = Middleware<ICustomMessageContext<S, P>>

export interface ICommandOptions<
    M extends Module = Module,
    S = ContextDefaultState,
    P = {}
> {
    module: M
    message: ICustomMessageContext<S, P>,

    dispatcher: MiddlewareDispatcher<ICustomMessageContext<S, P>>;
}

export type FactoryCommandOptions<
    M extends Module = Module,
    S = ContextDefaultState,
    P = {}
> = ICommandOptions<M, S, P>;

/**
 * Command
 */
export abstract class Command<
    M extends Module = Module,
    S = ContextDefaultState,
    P = {}
> {
    
    /**
     * Module
     */
    public module: M;

    /**
     * Message context
     */
    protected message: ICustomMessageContext<S, P>

    /**
     * Hear condition
     */
    private hearCondition!: CommandHearCondition<S, P>;

    /**
     * Callback
     */
    private callback!: CommandCallback<S, P>;

    /**
     * Middleware dispatcher
     */
    private dispatcher: MiddlewareDispatcher<ICustomMessageContext<S, P>>;

    /**
     * Check the message context for hear condition
     */
    public async checkHearCondition(): Promise<boolean> {
        if (!this.hearCondition)
            return false;

        if (this.hearCondition instanceof RegExp)
            return this.hearCondition.test(this.message.text || '');

        await this.dispatcher.dispatchMiddleware(this.message, this.hearCondition);

        return !this.dispatcher.hasMiddlewares;
    }

    /**
     * Invokes callback
     */
    public async invokeCallback(): Promise<MiddlewareReturn> {
        if (this.dispatcher.hasMiddlewares)
            this.dispatcher.clearMiddlewares();

        return this.dispatcher.dispatchMiddleware(this.message, this.callback);  
    }

	/**
	 * Returns custom tag
	 */
     public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

    /**
     * Constructor
     */
    protected constructor(options : ICommandOptions<M, S, P>) {
        this.module = options.module;
        this.message = options.message;

        this.dispatcher = options.dispatcher;
    }

    /**
     * Sets the middleware for hear condition
     */
     protected setHearCondition(hearCondition: CommandHearCondition<S, P>): void {
        this.hearCondition = hearCondition;
    }

    /**
     * Sets the callback middleware
     */
    protected setCallback(callback: CommandCallback<S, P>): void {
        this.callback = callback;
    }
}