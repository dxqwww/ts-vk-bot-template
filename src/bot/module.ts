import { MessageContext } from "vk-io";

import { Bot } from "@Main/bot";
import { Command } from "@Main/command";
import { Constructor } from '@Main/types';

export type ModuleCheckAccess<T extends MessageContext = MessageContext> = (context: T) => boolean | Promise<boolean>;

export interface IModuleOptions<
    Name extends string = string,

    B extends Bot = Bot,
    T extends MessageContext = MessageContext
> {
    message: T;

    bot: B;
    name: Name;
}

export type FactoryModuleOptions<Name extends string> = IModuleOptions<Name>;

export class Module<
    Name extends string = string,

    B extends Bot = Bot,
    T extends MessageContext = MessageContext
> {

    public bot: Bot;

    public name: Name;

    protected message: T;

    private checkAccess!: ModuleCheckAccess;

    private commands: Constructor<Command>[];

    public constructor({ ...options }: IModuleOptions<Name, B, T>) {
        this.bot = options.bot;
        this.message = options.message;
        this.name = options.name;
    }

    public setCommands(...commands: Constructor<Command>[]): void {
        this.commands = [
            ...commands
        ];
    }

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

    private initCommand(Command: Constructor<Command>): Command {
        return new Command({
            module: this,
            message: this.message
        });
    }

    private setCheckAccess(checkAccess: ModuleCheckAccess): void {
        this.checkAccess = checkAccess;
    }

    private async contextHasAccess(): Promise<boolean> {
        return !!this.checkAccess && this.checkAccess(this.message);
    }
}