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
} from '@Main/modules/Hello/commands';

export interface IHelloModuleContext {
    moduleAccess: {
        unprefixed: string;
    };
}

/**
 * Опции для текущего модуля
 */
export type HelloModuleOptions = FactoryModuleOptions<IHelloModuleContext>;

/**
 * Главный класс модуля. Наследуется от Module
 * 
 * @argument S - Дополнительный контекст, который хранится в state
 */
export class HelloModule extends Module<
    IHelloModuleContext
> {
    public constructor({ ...options }: HelloModuleOptions) {
        super({ ...options });

        /**
         * Установка проверки к модулю
         */
        this.setAccess((context, next) => {
            const tRegEx = /^hello/i;

            if (!tRegEx.test(context.text))
                return;

            context.state.moduleAccess = {
                unprefixed: context.text.replace(tRegEx, '').trim()
            }

            return next();
        });

        /**
         * Установка команд для модуля
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

Также можно установить middleware для проверки доступа к модулю, в нашем примере идёт проверка на префикс `hello` в начале каждого сообщения, после чего обновления контекста сообщения, и дальнейшая его передача в контекст команд этого модуля. 

```ts
public setAccess(access: ModuleCheckAccess): void
```

## Команды

Все команды расположены в директории `./commands` каждого модуля. Разберем уже готовой команды `HelloCommand`, нашего модуля `HelloModule`, которая находится здесь `modules/Hello/commands/hello.ts`:

```ts
import { Command, FactoryCommandOptions } from '@Main/command';

import { HelloModule, IHelloModuleContext } from '@Main/modules/Hello';

/**
 * Опции команды
 */
export type HelloCommandOptions = 
    FactoryCommandOptions<HelloModule, IHelloModuleContext>;

/**
 * Команда модуля. Наследуется от Command
 * 
 * @argument M — Модуль, к которому подключается команда.
 * @argument S — Дополнительный контекст, который хранится в state
 */
export class HelloCommand extends Command<
    HelloModule,
    IHelloModuleContext
> {
    public constructor({ ...options }: HelloCommandOptions) {
        super({ ...options });

        /**
         * Установка прослушки для текущей команды
         */
        this.setHearCondition((context, next) => {
            const { moduleAccess } = context.state;

            const cRegEx = /^ping$/i;

            if (!cRegEx.test(moduleAccess.unprefixed))
                return;

            return next();
        });
        
        /**
         * Установка callback`а для текущей команды
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

Запускаем бота и проверяем его работу. Теперь если написать нашему боту сообщение с префиксом `hello` и дальнейшей командой `ping` — он ответит нам `pong`:

![Пример работы команды](https://sun9-57.userapi.com/impf/Q9g5t4pSp9fcW1WSDJ4MHwyJ8e48STJB3m5kag/D3clL5_1FB4.jpg?size=203x111&quality=96&sign=a6d7769f8fe1c30fdc36eeed8be9f986&type=album)
