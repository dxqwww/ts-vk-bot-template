# TypeScript шаблон для создания ботов ВК
Этот шаблон - удобная оболочка для создания ботов ВК. Главным преимуществом является модульность и поддержка ООП.

Данный шаблон использует библиотеку [vk-io](https://github.com/negezor/vk-io/)

# Установка и конфигурация

Перед установкой убедитесь, что у вас установлен компилятор `typescript` :D

```
npm install -g typescript
```

## Установка
Чтобы начать использовать шаблон необходимо клонировать этот репозиторий к себе и установить все зависимости:

```
git clone https://github.com/SweetDreamzZz/ts-vk-bot-template
npm install
```

## Файл конфигурации

В главной директории шаблона присутствует файл `config.json.template`, его структура:

```js
{
    "vk": {
        "token": "YOUR_TOKEN",
        "group_id": "YOUR_GROUP_ID",
        "api_version": "YOUR_API_VERSION"
    }
}
```

Меняем данные на свои и переименовываем файл в `config.json`

# Билд и запуск

Билдим наш проект и запускаем!

```
npm run-script build
npm start
```

или одной командой

```
npm run-script build && npm start
```

Если в консоле появилась надпись `Started!`, значит всё работает. Теперь можно выключать бота и переходить к разбору структуры.

# Структура шаблона

Основная директория бота `src`, в ней находится весь исходный код.

## Модули

Данная имплементация работает на модулях, в папке `/modules` содержаться все модули, которые будет подгружать бот.
Каждый модуль предсталвяет собой отдельный класс, в котором происходит инициализация доступных ему команд. Это может быть удобно, чтобы объединять команды в блоки и давать им общий функционал.

Для примера возьмем стартовый, доступный после клонирования, модуль `HelloModule`, который находится здесь `modules/Hello/hello.ts`:

```ts
import { FactoryModuleOptions, Module } from "@Main/module";

import {
    HelloCommand
} from '@Main/modules/Hello/commands'

/*
 * Имя для текущего модуля
*/
export type HelloModuleName = "Hello module";

export type HelloModuleOptions = FactoryModuleOptions<HelloModuleName>


/*
 * Главный класс модуля
*/
export class HelloModule extends Module<
    HelloModuleName
> {
    public constructor({ ...options }: HelloModuleOptions) {
        super({
            name: "Hello module",

            ...options
        });

        /*
         * Объявление доступных для текущего модуля команд 
        */
        this.setCommands(
            HelloCommand
        );
    }
}
```

### setCommands

Основной метод, который можно использовать в каждом модуле. Устанавливает доступные для текущего модуля команды.

```ts
public setCommands(...commands: Constructor<Command>[]): void
```

## Команды

Все команды расположены в директории `./commands` каждого модуля. Разберем уже готовой команды `HelloCommand`, нашего модуля `HelloModule`, которая находится здесь `modules/Hello/commands/hello.ts`:

```ts
import { Command, FactoryCommandOptions } from '@Main/command';

import { HelloModule } from '@Main/modules/Hello';

export type HelloCommandOptions = FactoryCommandOptions<HelloModule>;

/*
 * Класс команды
*/
export class HelloCommand extends Command<
    HelloModule
> {
    public constructor({ ...options }: HelloCommandOptions) {
        super({ ...options });

        /*
         * Установка прослушки для текущей команды
        */
        this.setHearCondition((context, next) => {
            const textRegExp = /^(!|\.|\/)ping$/i;

            if (!textRegExp.test(context.text || null))
                return;

            return next();
        });
        
        /*
         * Установка нашей callback функции, в случае если прослушка сработала.
        */
        this.setCallback(context => (
            context.send("pong")
        ));
    }
}
```

У каждой команды есть два основных метода:

### setHearCondition 
Устанавливает условие для вызова `callback` функции. В качестве аргумента может принимать `Middleware` или `RegExp`.

```ts
protected setHearCondition(hearCondition: CommandHearCondition<T>): void
```

### setCallback 
Устанавливает `callback` для команды. В качестве аргумента принимает `Middleware`.

```ts
protected setCallback(callback: CommandCallback<T>): void
```

# Результат

Запускаем бота и проверяем его работу. Теперь если написать нашему боту `!ping` - он ответит `pong`:

![Пример работы команды](https://sun9-55.userapi.com/impf/OkX3dLy8nEvgXQPUfrcOMnpP6ifE_44KM3WlHg/yXDJgE10XwI.jpg?size=192x124&quality=96&sign=8203a19590404c72bf303c80c6539f23&type=album)
