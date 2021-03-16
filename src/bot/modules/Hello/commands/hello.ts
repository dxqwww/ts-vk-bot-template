import { Command, FactoryCommandOptions } from '@Main/command';

import { HelloModule } from '@Main/modules/Hello';

export type HelloCommandOptions = 
    FactoryCommandOptions<HelloModule>;

export class HelloCommand extends Command<
    HelloModule
> {
    public constructor({ ...options }: HelloCommandOptions) {
        super({ ...options });

        this.setHearCondition((context, next) => {
            const textRegExp = /^(!|\.|\/)ping$/i;

            if (!textRegExp.test(context.text || null))
                return;

            return next();
        });

        this.setCallback(context => (
            context.send("pong")
        ));
    }
}