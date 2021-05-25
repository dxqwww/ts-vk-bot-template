import { Command, FactoryCommandOptions } from '@Main/command';

import { HelloModule } from './module';

export type HelloCommandOptions = FactoryCommandOptions<HelloModule>;

export class HelloCommand extends Command<
    HelloModule
    > {
    public constructor({ ...options }: HelloCommandOptions) {
        super({ ...options });

        this.setHearCondition(/^ping$/i);

        this.setCallback(context => (
            context.send("pong")
        ));
    }
}