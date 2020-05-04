import { Bot } from "./Bot";
import { MessageContext } from "vk-io";
import { Command } from "./Command";

class Module {
    bot: Bot;
    private commands: Command[];
    constructor(bot: Bot) {
        this.bot = bot;
        this.commands = []
    }

    protected initCommands(commands: Command[]) {
        this.commands = [
            ...this.commands,
            ...commands
        ];
    }
    
    public checkContext(context: MessageContext): Command | null {
        return this.commands.find(command => command.check(context)) || null;
    }
}

export {
    Module
}