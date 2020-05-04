import { Module } from "../../Module";
import { Bot } from "../../Bot";

import {
    TestCommand
} from "./commands";

class Test extends Module {
    bot: Bot;
    constructor(bot: Bot) {
        super(bot);

        this.bot = bot;

        this.initCommands([
            new TestCommand(this)
        ]);
    }
}

export {
    Test
}