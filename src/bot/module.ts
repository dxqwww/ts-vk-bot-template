import { ContextDefaultState } from "vk-io";

import { Middleware, MiddlewareDispatcher, SweetConsole } from "@Main/utils";

import { Bot } from "@Main/bot";
import { Command } from "@Main/command";
import { Constructor, ICustomMessageContext } from '@Main/types';

export interface IModuleOptions<
    S = ContextDefaultState,
    P = {}
> {
    message: ICustomMessageContext<S, P>

    bot: Bot;
}

export type FactoryModuleOptions<S = ContextDefaultState, P = {}> = IModuleOptions<S, P>;

export type ModuleCheckAccess<S = ContextDefaultState, P = {}> = Middleware<ICustomMessageContext<S, P>>

/**
 * Главный класс модуля
 */
export abstract class Module<
    S = ContextDefaultState,
    P = {}
> {

    /**
     * Инстанция Bot
     */
    public bot: Bot;

    /**
     * Контекст только что полученного сообщения
     */
    protected message: ICustomMessageContext<S, P>;

    /**
     * Middleware-функция, которая проверяет доступ к модулю
     */
    private access: ModuleCheckAccess<S, P>;

    /**
     * Список команд модуля
     */
    private commands: Constructor<Command>[];

    /**
     * Инстанция MiddlwareDispatcher
     */
     private dispatcher: MiddlewareDispatcher<ICustomMessageContext<S, P>>;

    /**
     * Constructor
     */
    public constructor({ ...options }: IModuleOptions<S, P>) {
        this.bot = options.bot;
        this.message = options.message;

        this.dispatcher = new MiddlewareDispatcher<ICustomMessageContext<S, P>>()
    }

    /**
     * Ищет команду, которая может быть прослушена с текущем контекстом сообщения
     */
    public async findCommand(): Promise<Command> {
        const cHasAccess = await this.contextHasAccess();

        if (!cHasAccess)
            return null;

        if (!this.commands.length)
        {
            SweetConsole.Warn(`${this[Symbol.toStringTag]} has no active commands!`)
            return null;
        }

        for (const Command of this.commands) {
            const command = this.initCommand(Command);

            const canInvoke = await command.checkHearCondition();
            
            if (!canInvoke)
                continue;

            return command;
        }
    }

    /**
     * Returns custom tag
     */
    public get [Symbol.toStringTag](): string {
        return this.constructor.name;
    }

    /**
     * Устанавливает список переданных команд
     */
    protected setCommands(...commands: Constructor<Command>[]): void {
        this.commands = commands;
    }

    /**
     * Устанавливает Middleware-функцию, которая проверяет доступ к модулю
     */
     protected setAccess(access: ModuleCheckAccess<S, P>): void {
        this.access = access;
    }

    /**
     * Инициализирует команду модуля
     */
    private initCommand(Command: Constructor<Command>): Command {
        if (this.dispatcher.hasMiddlewares)
            this.dispatcher.clearMiddlewares();

        return new Command({
            module: this,
            dispatcher: this.dispatcher,

            message: this.message
        });
    }

    /**
     * Проверяет есть ли у контекста сообщения доуступ к модулю
     */
    private async contextHasAccess(): Promise<boolean> {
        if (!this.access)
            this.setAccess((_, next) => next());

        await this.dispatcher.dispatchMiddleware(this.message, this.access);

        return !this.dispatcher.hasMiddlewares;
    }
}