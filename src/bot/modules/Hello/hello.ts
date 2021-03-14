import { FactoryModuleOptions, Module } from "@Main/module";

import {
    HelloCommand
} from '@Main/modules/Hello/commands'

export type HelloModuleName = "Hello module";

export type HelloModuleOptions = FactoryModuleOptions<HelloModuleName>

export class HelloModule extends Module<
    HelloModuleName
> {
    public constructor({ ...options }: HelloModuleOptions) {
        super({
            name: "Hello module",

            ...options
        });

        this.setCommands(
            HelloCommand
        );
    }
}