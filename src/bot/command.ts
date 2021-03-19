import { MessageContext, ContextDefaultState } from "vk-io";

import { Module } from "@Main/module";

import { Middleware, MiddlewareDispatcher, MiddlewareReturn } from '@Utils/middleware';

export type CommandHearCondition<S = ContextDefaultState> = Middleware<MessageContext<S>> | RegExp;
export type CommandCallback<S = ContextDefaultState> = Middleware<MessageContext<S>>

export interface ICommandOptions<
    M extends Module = Module,
    S = ContextDefaultState
> {
    module: M
    message: MessageContext<S>,

    dispatcher: MiddlewareDispatcher<MessageContext<S>>;
}

export type FactoryCommandOptions<
    M extends Module = Module,
    S = ContextDefaultState
> = ICommandOptions<M, S>;

/**
 * Main Command class
 */
export class Command<
    M extends Module = Module,
    S = ContextDefaultState
> {
    
    /**
     * The module instance of command
     */
    public module: M;

    /**
     * Current received message
     */
    protected message: MessageContext<S>

    /**
     * Condition for listening of command
     */
    private hearCondition!: CommandHearCondition<S>;

    /**
     * Callback function of command
     */
    private callback!: CommandCallback<S>;

    /**
     * Middleware dispatcher instance
     */
    private dispatcher: MiddlewareDispatcher<MessageContext<S>>;

    /**
     * Constructor
     */
    public constructor({ ...options }: ICommandOptions<M, S>) {
        this.module = options.module;
        this.message = options.message;

        this.dispatcher = options.dispatcher;
    }

    /**
     * Checks the hear condition
     */
    public async checkHearCondition(): Promise<boolean> {
        if (!this.hearCondition)
            return;

        if (this.hearCondition instanceof RegExp)
            return this.hearCondition.test(this.message.text || null);

        await this.dispatcher.dispatchMiddleware(this.message, this.hearCondition);

        return !this.dispatcher.hasMiddlewares;
    }

    /**
     * Invokes the callback
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
     * Sets the hear condition
     */
     protected setHearCondition(hearCondition: CommandHearCondition<S>): void {
        this.hearCondition = hearCondition;
    }

    /**
     * Sets the callback
     */
    protected setCallback(callback: CommandCallback<S>): void {
        this.callback = callback;
    }
}