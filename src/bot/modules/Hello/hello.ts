import { FactoryModuleOptions, Module } from "@Main/module";

import {
    HelloCommand
} from '@Main/modules/Hello/commands';

export type HelloModuleOptions = FactoryModuleOptions;

export class HelloModule extends Module {
    public constructor({ ...options }: HelloModuleOptions) {
        super({ ...options });

        this.setCommands(
            HelloCommand
        );
    }
}