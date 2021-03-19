import { FactoryModuleOptions, Module } from "@Main/module";

import {
    HelloCommand
} from '@Main/modules/Hello/commands';

export interface IHelloModuleContext {
    moduleAccess: {
        unprefixed: string;
    };
}

/**
 * Опции для текущего модуля
 */
export type HelloModuleOptions = FactoryModuleOptions<IHelloModuleContext>;

/**
 * Главный класс модуля. Наследуется от Module
 * 
 * @argument S - Дополнительный контекст, который хранится в state
 */
export class HelloModule extends Module<
    IHelloModuleContext
> {
    public constructor({ ...options }: HelloModuleOptions) {
        super({ ...options });

        /**
         * Установка проверки к модулю
         */
        this.setAccess((context, next) => {
            const tRegEx = /^hello/i;

            if (!tRegEx.test(context.text))
                return;

            context.state.moduleAccess = {
                unprefixed: context.text.replace(tRegEx, '').trim()
            }

            return next();
        });

        /**
         * Установка команд для модуля
         */
        this.setCommands(
            HelloCommand
        );
    }
}