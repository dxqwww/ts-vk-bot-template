import { Command, FactoryCommandOptions } from '@Main/command';

import { HelloModule, IHelloModuleContext } from '@Main/modules/Hello';

/**
 * Опции команды
 */
export type HelloCommandOptions = 
    FactoryCommandOptions<HelloModule, IHelloModuleContext>;

/**
 * Команда модуля. Наследуется от Command
 * 
 * @argument M — Модуль, к которому подключается команда.
 * @argument S - Дополнительный контекст, который хранится в state
 */
export class HelloCommand extends Command<
    HelloModule,
    IHelloModuleContext
> {
    public constructor({ ...options }: HelloCommandOptions) {
        super({ ...options });

        /**
         * Установка прослушки для текущей команды
         */
        this.setHearCondition((context, next) => {
            const { moduleAccess } = context.state;

            const cRegEx = /^ping$/i;

            if (!cRegEx.test(moduleAccess.unprefixed))
                return;

            return next();
        });
        
        /**
         * Установка callback`а для текущей команды
         */
        this.setCallback(context => (
            context.send("pong")
        ));
    }
}