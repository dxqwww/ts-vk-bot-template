import chalk from 'chalk';

export class SweetConsole {
    private static debugMode: boolean = false;

    private static log(color: chalk.Chalk, type: string, message: string): typeof SweetConsole {
        const time = new Date().toLocaleString('ru-RU', {
           hour: 'numeric',
           minute: 'numeric',
           second: 'numeric' 
        });

        console.log(`[${chalk.bold.white(time)}][${color.bold(type)}] ${color(message)}`);

        return SweetConsole;
    }

    public static setDebugMode(mode: boolean) {
        SweetConsole.debugMode = mode;
    }

    public static Info(message: string): typeof SweetConsole {
        return SweetConsole.log(chalk.cyan, `INFO`, message);
    }

    public static Message(message: string): typeof SweetConsole
    {
        return SweetConsole.log(chalk.blueBright, `MESSAGE`, message);
    }

    public static Warn(message: string): typeof SweetConsole {
        return SweetConsole.log(chalk.yellow, `WARN`, message);
    }

    public static Error(message: string): typeof SweetConsole {
        return SweetConsole.log(chalk.red, `ERROR`, message);
    }

    public static Debug(message: string): typeof SweetConsole {
        return SweetConsole.debugMode ? SweetConsole.log(chalk.gray, `DEBUG`, message) : SweetConsole;
    }
}