import { Command } from "../../../Command";
import { Module } from "../../../Module";

export class TestCommand extends Command {
    constructor(module: Module) {
        super(module);

        this.setHearCondition(/(!|\.|\/)?ping/i);
        
        this.setCallback(context => {
            context.send('pong');
        });
    }
}