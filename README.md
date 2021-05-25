![First](https://sun9-40.userapi.com/impg/s13hFPmPchPSRgvJx1x3AHq2AUlJHtz9XiFQ2A/pxJ7m8h033s.jpg?size=1102x480&quality=96&sign=e89aa0151a190df1a3527008edca5412&type=album)

# TypeScript шаблон для создания ботов ВК

Этот шаблон - удобная оболочка для создания ботов ВК. Главным преимуществом является модульность и поддержка ООП.

Данный шаблон использует библиотеку [vk-io](https://github.com/negezor/vk-io/)

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

# Сборка и запуск

Собираем наш проект и запускаем:

```
npm run build
npm start
```

Если в консоле появились логи об успешном старте бота, значит всё работает.

![Успешный старт бота](https://sun9-33.userapi.com/impg/TOasq81qYMNTeEUZuO7cQAlj7TMMV684_WEcFA/xeaCdIzn70s.jpg?size=301x99&quality=96&sign=43e1950c087ce1fe40aed7ac54a5a361&type=album)

# Использование шаблона

Все разобранные ниже примеры находятся в директории `/examples` данного репозитория

## Модули

Любой модуль наследуется от базового класса `Module`.
В модуле происходит установка принадлежащих ему команд.

```ts
import { Module, FactoryModuleOptions } from '@Main/module';

import { HelloCommand } from './command';

export type HelloModuleOptions = FactoryModuleOptions;

export class HelloModule extends Module {
  public constructor({ ...options }: HelloModuleOptions) {
    super({ ...options });

    this.setCommands(
            HelloCommand
    );
  }
}
```

### Основные методы

#### setCommands

Устанавливает доступные для текущего модуля команды.

```ts
protected setCommands(...commands: Constructor<Command>[]): void
```

#### setAccess

Устанавливает условие для использование команд данного модуля.

`Параметры`:

* **ModuleCheckAccess**:
  * RegExp
  * Middleware
    
```ts
protected setAccess(access: ModuleCheckAccess): void
```

## Команды

Любая команда наследуется от базового класса `Command`.
В команде устанавливается условие для её прослушки и callback функция, 
которая вызывается, в случае, если прослушка сработала.

```ts
import { Command, FactoryCommandOptions } from '@Main/command';

import { HelloModule } from './module';

export type HelloCommandOptions = FactoryCommandOptions<HelloModule>;

export class HelloCommand extends Command<
    HelloModule
> {
    public constructor({ ...options }: HelloCommandOptions) {
        super({ ...options });
        
        this.setHearCondition(/^ping$/i);
        
        this.setCallback(context => (
            context.send("pong")
        ));
    }
}
```

### Основные методы



#### setHearCondition 
Устанавливает условие для прослушки команды.

`Параметры`:

* **CommandHearCondition**
  * RegExp
  * Middleware

```ts
protected setHearCondition(hearCondition: CommandHearCondition): void
```

#### setCallback 
Устанавливает callback функцию команды.

`Параметры`:

* **CommandCallback**
    * Middleware

```ts
protected setCallback(callback: CommandCallback): void
```

# Заключение

Выражаю благодарность [OctopuSSX](https://github.com/uzervlad) за его [osu! бота для ВК](https://github.com/OctoDumb/osubot), который вдохновил меня на создание данного шаблона.

# License

[MIT](https://github.com/SweetDreamzZz/ts-vk-bot-template/blob/master/LICENSE)
