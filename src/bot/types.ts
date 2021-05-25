import { ContextDefaultState, MessageContext } from 'vk-io';

export type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Message context with custom payload
 */
export interface ICustomMessageContext<S = ContextDefaultState, P = {}> extends MessageContext<S> {
    messagePayload: P;
}

/**
 * Интерфейс конфигурации бота
 */
export interface IBotConfig {
    vk: {
        token: string;
        group_id: number | string;
        api_version: string;
    }
}