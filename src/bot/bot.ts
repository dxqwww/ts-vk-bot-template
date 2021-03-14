import { MessageContext, VK } from 'vk-io'

import { Constructor, IBotConfig } from '@Main/types';
import { Module } from '@Main/module';

import {
    HelloModule
} from '@Main/modules';

export interface IBotOptions<
    Config extends IBotConfig = IBotConfig
> {
    config: Config;
}

export class Bot<
    T extends MessageContext = MessageContext,

    Config extends IBotConfig = IBotConfig,
> {

    public config: IBotConfig;

    public vk: VK;

    private modules: Constructor<Module>[];

    public constructor({ ...options }: IBotOptions<Config>) {
        this.config = options.config;

        this.vk = new VK({
            token: this.config.vk.token,
            pollingGroupId: Number(this.config.vk.group_id),
            apiVersion: this.config.vk.api_version
        });

        this.setModules(
            HelloModule
        );

        this.vk.updates.on('message_new', async (context: T) => {
            for (const Module of this.modules) {
                const module = this.initModule(Module, context);

                const command = await module.findCommand();

                if (!command)
                    continue;

                return command.invokeCallback();
            }

            return context.send("No available commands");
        });
    }

    public start(): Promise<void> {
        return this.vk.updates.start();
    }

    public stop(): Promise<void> {
        return this.vk.updates.stop();
    }

    protected setModules(...modules: Constructor<Module>[]): void {
        this.modules = [
            ...modules
        ];
    } 

    protected initModule(Module: Constructor<Module>, context: T): Module {
        return new Module({
            bot: this,
            message: context
        });
    }
}