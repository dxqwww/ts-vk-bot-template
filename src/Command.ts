import { Module } from "./Module";
import { MessageContext } from "vk-io";

class Command {
    public module: Module;
    private hearCondition: ((context: MessageContext) => boolean) | RegExp;
    private callback: (context: MessageContext) => void;
    constructor(module: Module) {
        this.module = module;

        this.hearCondition = (context: MessageContext) => false;
        this.callback = (context: MessageContext) => {}
    }

    public setHearCondition(hearCondition: ((context: MessageContext) => boolean) | RegExp) {
        this.hearCondition = hearCondition;
    }

    public setCallback(callback: (context: MessageContext) => void) {
        this.callback = callback;
    }

    public execute(context: MessageContext) {
        return this.callback(context);
    }


    public check(context: MessageContext): boolean {
        if (typeof this.hearCondition === 'function')
            return this.hearCondition(context);
        
        if (typeof context.text === 'string')
            return this.hearCondition.test(context.text);
        
        return false;
    }
}

export {
    Command
}