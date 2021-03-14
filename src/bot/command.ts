import { MessageContext } from "vk-io";

import { Module } from "@Main/module";

import { Middleware, MiddlewareDispatcher } from '@Utils/middleware';

export type CommandHearCondition<T> = Middleware<T> | RegExp;
export type CommandCallback<T> = Middleware<T>

export interface ICommandOptions<
    M extends Module = Module,
    T extends MessageContext = MessageContext
> {
    message: T;

    module: M;
}

export type FactoryCommandOptions<M extends Module> = ICommandOptions<M>;

export class Command<
    M extends Module = Module,
    T extends MessageContext = MessageContext
> {
    
    public module: M;

    protected message: T;

    private hearCondition!: CommandHearCondition<T>;

    private callback!: CommandCallback<T>;

    private dispatcher: MiddlewareDispatcher<T>;

    public constructor({ ...options }: ICommandOptions<M, T>) {
        this.module = options.module;
        this.message = options.message;

        this.dispatcher = new MiddlewareDispatcher<T>();
    }

    protected setHearCondition(hearCondition: CommandHearCondition<T>): void {
        this.hearCondition = hearCondition;
    }

    protected setCallback(callback: CommandCallback<T>): void {
        this.callback = callback;
    }

    public async checkHearCondition(): Promise<boolean> {
        if (!this.hearCondition)
            return;

        if (this.hearCondition instanceof RegExp)
            return this.hearCondition.test(this.message.text || null);

        await this.dispatcher.dispatchMiddleware(this.message, this.hearCondition);

        return !this.dispatcher.hasMiddlewares();
    }

    public async invokeCallback(): Promise<void> {
        if (this.dispatcher.hasMiddlewares())
            this.dispatcher.clearMiddlewares();

        await this.dispatcher.dispatchMiddleware(this.message, this.callback);  
    }
}