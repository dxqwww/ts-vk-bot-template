import { VK } from 'vk-io'
import { Module } from './Module';

import {
    IConfig 
} from './Types'

import {
    Test
} from './modules'


class Bot {
    config: IConfig;
    vk: VK;
    private modules: Module[];
    constructor(config: IConfig) {
        this.config = config;

        this.vk = new VK({
            token: config.vk.token,
            pollingGroupId: config.vk.group_id || undefined
        });

        this.modules = []
        this.initModules([
            new Test(this)
        ]);

        this.vk.updates.on('new_message', context => {
            for (const module of this.modules) {
                const command = module.checkContext(context);

                if (!command)
                    continue;

                return command.execute(context);
            }

            return context.send('Unknown command');
        });
    }

    initModules(modules: Module[]) {
        this.modules = [
            ...this.modules,
            ...modules
        ];
    }

    async start() {
        this.vk.updates.start();
        console.log('Started');
    }

    async stop() {
        this.vk.updates.stop();
        console.log('Stoped');
    }
}

export {
    Bot
}