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
 * Module
 */
export abstract class Module<
    S = ContextDefaultState,
    P = {}
> {

    /**
     * Bot
     */
    public bot: Bot;

    /**
     * Message context
     */
    protected message: ICustomMessageContext<S, P>;

    /**
     * Module's access middleware
     */
    private access!: ModuleCheckAccess<S, P>;

    /**
     * List of module's commands
     */
    private commands: Constructor<Command>[] = [];

    /**
     * Middleware dispatcher
     */
     private dispatcher: MiddlewareDispatcher<ICustomMessageContext<S, P>>;

    /**
     * Looking for a command that can be listen
     */
    public async findCommand(): Promise<Command | undefined> {
        const cHasAccess = await this.contextHasAccess();

        if (!cHasAccess)
            return;

        if (!this.commands.length)
        {
            SweetConsole.Warn(`${this[Symbol.toStringTag]} has no active commands!`)
            return;
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
     * Constructor
     */
    protected constructor(options: IModuleOptions<S, P>) {
        this.bot = options.bot;
        this.message = options.message;

        this.dispatcher = new MiddlewareDispatcher<ICustomMessageContext<S, P>>()
    }

    /**
     * Sets the list of module's commands
     */
    protected setCommands(...commands: Constructor<Command>[]): void {
        this.commands = commands;
    }

    /**
     * Sets the module's access middleware
     */
     protected setAccess(access: ModuleCheckAccess<S, P>): void {
        this.access = access;
    }

    /**
     * Returns the instance of command
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
     * Checks message context for access to module
     */
    private async contextHasAccess(): Promise<boolean> {
        if (!this.access)
            this.setAccess((_, next) => next());

        await this.dispatcher.dispatchMiddleware(this.message, this.access);

        return !this.dispatcher.hasMiddlewares;
    }
}