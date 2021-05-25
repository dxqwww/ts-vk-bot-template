import chalk from 'chalk';

export class SweetConsole {
    private static debugMode: boolean = false;

    /**
     * Prints the colorful message in console with current time and prefix
     */
    private static log(color: chalk.Chalk, type: string, message: string): typeof SweetConsole {
        const time = new Date().toLocaleString('ru-RU', {
           hour: 'numeric',
           minute: 'numeric',
           second: 'numeric' 
        });

        console.log(`[${chalk.bold.white(time)}][${color.bold(type)}] ${color(message)}`);

        return SweetConsole;
    }

    /**
     * Sets the debug mode
     */
    public static setDebugMode(mode: boolean) {
        SweetConsole.debugMode = mode;
    }

    /**
     * Logs the info message
     */
    public static Info(message: string): typeof SweetConsole {
        return SweetConsole.log(chalk.cyan, `INFO`, message);
    }

    /**
     * Logs the default message
     */
    public static Message(message: string): typeof SweetConsole
    {
        return SweetConsole.log(chalk.blueBright, `MESSAGE`, message);
    }

    /**
     * Logs the warn message
     */
    public static Warn(message: string): typeof SweetConsole {
        return SweetConsole.log(chalk.yellow, `WARN`, message);
    }

    /**
     * Logs the error message
     */
    public static Error(message: string): typeof SweetConsole {
        return SweetConsole.log(chalk.red, `ERROR`, message);
    }

    /**
     * Logs the debug message
     */
    public static Debug(message: string): typeof SweetConsole {
        return SweetConsole.debugMode ? SweetConsole.log(chalk.gray, `DEBUG`, message) : SweetConsole;
    }
}