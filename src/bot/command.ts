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
 * Главный класс команды
 */
export abstract class Command<
    M extends Module = Module,
    S = ContextDefaultState,
    P = {}
> {
    
    /**
     * Инстанция модуля команды
     */
    public module: M;

    /**
     * Контекст только что полученного сообщения
     */
    protected message: ICustomMessageContext<S, P>

    /**
     * Middleware-функция условия прослушки сообщения
     */
    private hearCondition!: CommandHearCondition<S, P>;

    /**
     * Middleware-функция callback'а в случае, если прослушка сработает
     */
    private callback!: CommandCallback<S, P>;

    /**
     * Инстанция MiddlewareDispatcher
     */
    private dispatcher: MiddlewareDispatcher<ICustomMessageContext<S, P>>;

    /**
     * Constructor
     */
    public constructor({ ...options }: ICommandOptions<M, S, P>) {
        this.module = options.module;
        this.message = options.message;

        this.dispatcher = options.dispatcher;
    }

    /**
     * Проверяет может ли контекст быть прослушанным
     */
    public async checkHearCondition(): Promise<boolean> {
        if (!this.hearCondition)
            return false;

        if (this.hearCondition instanceof RegExp)
            return this.hearCondition.test(this.message.text);

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
     protected setHearCondition(hearCondition: CommandHearCondition<S, P>): void {
        this.hearCondition = hearCondition;
    }

    /**
     * Устанавливает middleware-функцию callback`а
     */
    protected setCallback(callback: CommandCallback<S, P>): void {
        this.callback = callback;
    }
}