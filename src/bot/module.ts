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
 * Main Module class
 */
export class Module<
    S = ContextDefaultState
> {

    /**
     * The Bot instance
     */
    public bot: Bot;

    /**
     * Current received message
     */
    protected message: MessageContext<S>;

    /**
     * Module access check
     */
    private access!: ModuleCheckAccess<S>;

    /**
     * List of all module commands
     */
    private commands: Constructor<Command>[];

    /**
     * Middleware dispatcher instance
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
     * Sets list of module commands
     */
    public setCommands(...commands: Constructor<Command>[]): void {
        this.commands = [
            ...commands
        ];
    }

    /**
     * Looking for a command that is being listened
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
     * Sets the module check access
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
     * Initializes the single module command
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
     * Checks if the context has access
     */
    private async contextHasAccess(): Promise<boolean> {
        if (!this.access)
            return;

        await this.dispatcher.dispatchMiddleware(this.message, this.access);

        return !this.dispatcher.hasMiddlewares;
    }
}