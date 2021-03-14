import { Bot } from '@Main/bot';
import config from '@Config';

const main = async () => {
    const bot = new Bot({ config });

    await bot.start();
};

main();