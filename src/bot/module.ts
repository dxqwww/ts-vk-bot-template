import { MessageContext, ContextDefaultState } from "vk-io";

import { Bot } from "@Main/bot";
import { Command } from "@Main/command";
import { Constructor } from '@Main/types';

import { Middleware, MiddlewareDispatcher } from "@Utils/middleware";

export interface IModuleOptions<
    S = ContextDefaultState
> {
    message: MessageContext<S>

    bot: Bot;
}

export type FactoryModuleOptions<S = ContextDefaultState> = IModuleOptions<S>;

export type ModuleCheckAccess<S = ContextDefaultState> = Middleware<MessageContext<S>>

/**
 * Главный класс модуля
 */
export class Module<
    S = ContextDefaultState
> {

    /**
     * Инстанция Bot
     */
    public bot: Bot;

    /**
     * Контекст только что полученного сообщения
     */
    protected message: MessageContext<S>;

    /**
     * Middleware-функция, которая проверяет доступ к модулю
     */
    private access: ModuleCheckAccess<S>;

    /**
     * Список команд модуля
     */
    private commands: Constructor<Command>[];

    /**
     * Инстанция MiddlwareDispatcher
     */
     private dispatcher: MiddlewareDispatcher<MessageContext<S>>;

    /**
     * Constructor
     */
    public constructor({ ...options }: IModuleOptions<S>) {
        this.bot = options.bot;
        this.message = options.message;

        this.dispatcher = new MiddlewareDispatcher<MessageContext<S>>()
    }

    /**
     * Устанавливает список переданных команд 
     */
    public setCommands(...commands: Constructor<Command>[]): void {
        this.commands = [
            ...commands
        ];
    }

    /**
     * Ищет команду, которая может быть прослушена с текущем контекстом сообщения
     */
    public async findCommand(): Promise<Command> {
        const cHasAccess = await this.contextHasAccess();

        if (!cHasAccess)
            return;

        for (const Command of this.commands) {
            const command = this.initCommand(Command);

            const canInvoke = await command.checkHearCondition();
            
            if (!canInvoke)
                continue;

            return command;
        }
    }
    
    /**
     * Устанавливает Middleware-функцию, которая проверяет доступ к модулю
     */
     public setAccess(access: ModuleCheckAccess<S>): void {
        this.access = access;
    }

	/**
	 * Returns custom tag
	 */
     public get [Symbol.toStringTag](): string {
		return this.constructor.name;
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