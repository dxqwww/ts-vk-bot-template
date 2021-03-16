import { MessageContext, ContextDefaultState } from "vk-io";

import { Bot } from "@Main/bot";
import { Command } from "@Main/command";
import { Constructor } from '@Main/types';

export interface IModuleOptions<
    S = ContextDefaultState
> {
    message: MessageContext<S>

    bot: Bot;
}

export type FactoryModuleOptions<S = ContextDefaultState> = IModuleOptions<S>;

export type ModuleCheckAccess<T extends MessageContext = MessageContext> = (context: T) => boolean | Promise<boolean>;

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
    private checkAccess!: ModuleCheckAccess;

    /**
     * List of all module commands
     */
    private commands: Constructor<Command>[];

    /**
     * Constructor
     */
    public constructor({ ...options }: IModuleOptions<S>) {
        this.bot = options.bot;
        this.message = options.message;
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
        if (!this.contextHasAccess())
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
	 * Returns custom tag
	 */
     public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

    /**
     * Initializes the single module command
     */
    private initCommand(Command: Constructor<Command>): Command {
        return new Command({
            module: this,
            message: this.message
        });
    }

    /**
     * Sets the module check access
     */
    private setCheckAccess(checkAccess: ModuleCheckAccess): void {
        this.checkAccess = checkAccess;
    }

    /**
     * Checks if the context has access
     */
    private async contextHasAccess(): Promise<boolean> {
        return !!this.checkAccess && this.checkAccess(this.message);
    }
}