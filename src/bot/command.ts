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
 * Главный класс команды
 */
export class Command<
    M extends Module = Module,
    S = ContextDefaultState
> {
    
    /**
     * Инстанция модуля команды
     */
    public module: M;

    /**
     * Контекст только что полученного сообщения
     */
    protected message: MessageContext<S>

    /**
     * Middleware-функция условия прослушки сообщения
     */
    private hearCondition!: CommandHearCondition<S>;

    /**
     * Middleware-функция callback'а в случае, если прослушка сработает
     */
    private callback!: CommandCallback<S>;

    /**
     * Инстанция MiddlewareDispatcher
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
     * Проверяет может ли контекст быть прослушанным
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
     * Вызывает middleware-функцию функцию callback'а
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
     * Устанавливает middleware-функцию для прослушки
     */
     protected setHearCondition(hearCondition: CommandHearCondition<S>): void {
        this.hearCondition = hearCondition;
    }

    /**
     * Устанавливает middleware-функцию callback`а
     */
    protected setCallback(callback: CommandCallback<S>): void {
        this.callback = callback;
    }
}