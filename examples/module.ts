import { Module, FactoryModuleOptions } from '@Main/module';

import { HelloCommand } from './command';

export type HelloModuleOptions = FactoryModuleOptions;

export class HelloModule extends Module {
    public constructor({ ...options }: HelloModuleOptions) {
        super({ ...options });

        this.setCommands(
            HelloCommand
        );
    }
}