import { Bot } from '@Main/bot';
import { _PROJECT_INFO, SweetConsole } from "@Main/utils";

import config from '@Config';
import chalk from "chalk";

(async function main(bot: Bot): Promise<void> {
    SweetConsole.setDebugMode(true);

    console.clear();

    console.log(chalk.blueBright(`\n\n${_PROJECT_INFO.ascii_art}\n\n`));

    SweetConsole.Warn(`Thanks for using ${_PROJECT_INFO.name}!`)
                .Warn(`Version: ${_PROJECT_INFO.version}`)
                .Warn(`Author: ${_PROJECT_INFO.author}`)
                .Warn(`If you notice any bug, please report it: https://github.com/${_PROJECT_INFO.author}/${_PROJECT_INFO.name}/issues`);

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