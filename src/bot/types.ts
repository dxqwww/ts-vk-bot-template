export type Constructor<T = {}> = new (...args: any[]) => T;

export interface IBotConfig {
    vk: {
        token: string;
        group_id: number | string;
        api_version: string;
    }
};