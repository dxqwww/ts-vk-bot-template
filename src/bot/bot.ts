import { VK } from 'vk-io'

import { Constructor, IBotConfig, ICustomMessageContext } from '@Main/types';
import { Module } from '@Main/module';
import { SweetConsole } from "@Main/utils";

export interface IBotOptions<
    Config extends IBotConfig = IBotConfig
> {
    config: Config;
}

/**
 * Главный класс бота
 */
export class Bot<
    T extends ICustomMessageContext = ICustomMessageContext,

    Config extends IBotConfig = IBotConfig,
> {
    /**
     * Конфигурация бота
     */
    public config: IBotConfig;

    /**
     * Инстанция vk-io
     */
    public vk: VK;

    /**
     * Список всех доступных модулей
     */
    private modules: Constructor<Module>[];

    /**
     * Constructor
     */
    public constructor({ ...options }: IBotOptions<Config>) {
        this.config = options.config;

        this.vk = new VK({
            token: this.config.vk.token,
            pollingGroupId: Number(this.config.vk.group_id),
            apiVersion: this.config.vk.api_version
        });

        this.vk.updates.on('message_new', async (context: T) => {
            if (!this.modules.length)
                return SweetConsole.Warn(`${this[Symbol.toStringTag]} has no active modules!`)

            for (const Module of this.modules) {
                const module = this.initModule(Module, context);

                const command = await module.findCommand();

                if (!command)
                    continue;

                return command.invokeCallback();
            }
        });
    }

    /**
     * Проверяет запущена ли прослушка
     */
    public get isStarted(): boolean {
        return this.vk.updates.isStarted;
    }

    /**
     * Запускаеет прослушку сообщений
     */
    public start(): Promise<void> {
        return this.vk.updates.start();
    }

    /**
     * Прекращает получение обновлений
     */
    public stop(): Promise<void> {
        return this.vk.updates.stop();
    }

	/**
	 * Возвращает кастомный тег
	 */
     public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

    /**
     * Устанавливает список переданных моудлей
     */
    private setModules(...modules: Constructor<Module>[]): void {
        this.modules = modules;
    } 

    /**
     * Инициализирует модуль с указанным контекстом
     */
    private initModule(Module: Constructor<Module>, context: T): Module {
        return new Module({
            bot: this,
            message: context
        });
    }
}