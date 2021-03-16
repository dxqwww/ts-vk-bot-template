import { Bot } from '@Main/bot';
import config from '@Config';

const main = async () => {
    const bot = new Bot({ config });

    bot.start()
    .then(() => console.log('Started!'))
    .catch(console.error);
};

main();