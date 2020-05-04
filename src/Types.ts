interface IConfigVK {
    token: string;
    group_id: number;
};

interface IConfig {
    vk: IConfigVK;
};

export {
    IConfig
}