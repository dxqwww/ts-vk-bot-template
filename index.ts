import { Bot } from '@Main/bot';
import { SweetConsole } from '@Utils/sweetconsole';

import config from '@Config';

(async function main(bot: Bot): Promise<void> {
    SweetConsole.setDebugMode(true);

    try {
        SweetConsole.Info(`Bot is starting...`);

        await bot.start()
    } catch (error) {
        SweetConsole.Error(`Bot failed to start!`)
                    .Debug(`${error.stack}`)
                    .Info(`Retrying after 10 seconds...`);

        setTimeout(() => main(bot), 10e3);
    }

    if (bot.isStarted)
        SweetConsole.Info(`Bot has started!`);
})(new Bot({ config }));