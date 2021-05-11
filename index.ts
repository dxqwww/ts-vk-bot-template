import { Bot } from '@Main/bot';
import { SweetConsole } from '@Utils/sweetconsole';

import config from '@Config';

(async function main(bot: Bot): Promise<void> {
    Bot.debugMode = true;

    try {
        SweetConsole.Info(`Bot is starting...`);

        await bot.start()
    } catch (error) {
        SweetConsole.Error(`Bot failed to start!`);

        if (Bot.debugMode)
            SweetConsole.Debug(`${error.stack}`);
            
        SweetConsole.Info(`Retrying after 10 seconds...`);

        setTimeout(() => main(bot), 10e3);
    }

    
    if (bot.isStarted)
        SweetConsole.Info(`Bot has started!`);
})(new Bot({ config }));