# Game Design Document

## Core Gameplay Loop

```
┌─────────────┐
│   Локация   │
│  (описание) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Выбор     │
│  действия   │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│  Проверка   │──────│  Эффекты    │
│  условий    │      │  (items,    │
└──────┬──────┘      │   stats)    │
       │             └─────────────┘
       ▼
┌─────────────┐
│   Новая     │
│  локация    │
└─────────────┘
```

## UI Layout

```
┌────────────────────────────────────────────────────────────────┐
│                         Header (?)                              │
├──────────────────────────┬─────────────────────────────────────┤
│                          │                                      │
│      Visual Panel        │           Quest Panel                │
│                          │                                      │
│   ┌──────────────────┐   │   ┌─────────────────────────────┐   │
│   │                  │   │   │                             │   │
│   │    Image /       │   │   │    Location description     │   │
│   │    Placeholder   │   │   │    and current situation    │   │
│   │                  │   │   │                             │   │
│   └──────────────────┘   │   └─────────────────────────────┘   │
│                          │                                      │
│   ┌──────────────────┐   │   ┌─────────────────────────────┐   │
│   │   Player Stats   │   │   │    Action choices:          │   │
│   │   HP: ████░░ 70  │   │   │    [1] Go to corridor       │   │
│   │   Mana: ███░ 60  │   │   │    [2] Search the room      │   │
│   │   Credits: 100   │   │   │    [3] Check inventory      │   │
│   └──────────────────┘   │   │                             │   │
│                          │   │    Or type custom action:   │   │
│   ┌──────────────────┐   │   │    [________________]       │   │
│   │   Inventory      │   │   └─────────────────────────────┘   │
│   │   - Keycard      │   │                                      │
│   │   - Wrench       │   │   ┌─────────────────────────────┐   │
│   └──────────────────┘   │   │   Terminal (when active)    │   │
│                          │   │   > _                        │   │
│   ┌──────────────────┐   │   │   [Execute]                 │   │
│   │   Avatar (?)     │   │   └─────────────────────────────┘   │
│   └──────────────────┘   │                                      │
│                          │                                      │
└──────────────────────────┴─────────────────────────────────────┘
```

## Player Character

### Stats (Phase 0)
| Stat | Description | Initial | Max |
|------|-------------|---------|-----|
| **HP** | Health points | 100 | 100 |

### Stats (Future Phases)
| Stat | Description | Initial | Max |
|------|-------------|---------|-----|
| **HP** | Health points | 100 | 100 |
| **Mana** | Magic/tech energy | 50 | 50 |
| **Credits** | Currency | 0 | - |

### Inventory
Список предметов, которые игрок собирает во время игры. Предметы могут:
- Открывать новые варианты действий
- Быть необходимы для прохождения (ключи, коды)
- Давать бонусы к статам
- Использоваться в определённых локациях

## Quest System

### Location Structure
```typescript
interface Location {
  id: string;                    // Уникальный ID
  name: string;                  // Название локации
  description: string;           // Описание (что видит игрок)
  image?: string;                // Картинка (опционально)
  onEnter?: Effect[];            // Эффекты при входе
  actions: Action[];             // Доступные действия
  terminals?: Terminal[];        // Терминалы для кода
}
```

### Action Types
| Type | Description | Example |
|------|-------------|---------|
| **move** | Перейти в другую локацию | "Пойти в коридор" |
| **interact** | Взаимодействие с объектом | "Осмотреть панель" |
| **take** | Взять предмет | "Взять ключ-карту" |
| **use** | Использовать предмет | "Использовать ключ" |
| **talk** | Диалог с NPC | "Поговорить с роботом" |

### Conditions
Действия могут требовать выполнения условий:

```typescript
interface Condition {
  // Требуется предмет
  item?: string;

  // Требуется стат
  stat?: {
    name: 'hp' | 'mana' | 'credits';
    min?: number;
    max?: number;
  };

  // Требуется флаг (пройденное событие)
  flag?: string;

  // Отсутствие флага
  notFlag?: string;
}
```

### Effects
Действия могут вызывать эффекты:

```typescript
interface Effect {
  type: 'addItem' | 'removeItem' | 'setStat' | 'modifyStat' | 'setFlag' | 'removeFlag';
  target: string;
  value?: any;
}
```

## Terminal System

Особая механика для программистских квестов:

```typescript
interface Terminal {
  id: string;
  name: string;
  description: string;           // Что нужно сделать
  challenge: string;             // Детальное описание задачи
  hint?: string;                 // Подсказка

  // Валидация решения
  validation: {
    type: 'exact' | 'regex' | 'eval';
    solution: string;            // Правильный ответ или паттерн
    testCases?: TestCase[];      // Для eval-типа
  };

  // Эффекты при успехе
  onSuccess: Effect[];

  // Сообщение при успехе
  successMessage: string;
}

interface TestCase {
  input: any;
  expected: any;
}
```

### Terminal Validation Types

1. **exact** — точное совпадение кода
2. **regex** — совпадение по регулярному выражению
3. **eval** — выполнение кода и проверка результата

## Answer Types

### 1. Predefined Choices
Стандартные варианты ответа с известными последствиями:
```
[1] Открыть дверь ключом
[2] Попытаться взломать замок
[3] Вернуться назад
```

### 2. Custom Input (Phase 1+)
Свободный ввод, валидируемый через LLM:
```
[Введите свой вариант]: Попробовать позвать на помощь

→ LLM оценивает:
  - Уместность в контексте
  - Возможные последствия
  - Генерирует ответ и эффекты
```

## Demo Quest: Ship Repair

### Setting
Космический корабль "Синтаксис-7". Бортовой AI работает на JavaScript. Из-за бага отключилась система питания.

### Locations

#### 1. Каюта (cabin)
```
Ты просыпаешься в своей каюте на борту "Синтаксис-7".
Аварийное освещение мигает красным. Тишина — обычно
гудящие системы жизнеобеспечения едва слышны.

Дверь в коридор автоматически не открывается —
похоже, нет питания на замках.
```

Actions:
- Осмотреть каюту → находим фонарик
- Попытаться открыть дверь вручную → успех если есть фонарик

#### 2. Коридор (corridor)
```
Тёмный коридор слабо освещён аварийными лампами.
Слева — путь к мостику, справа — к машинному отделению.
Таблички на стенах едва читаемы.
```

Actions:
- Пойти к мостику (заблокировано без ремонта)
- Пойти к машинному отделению

#### 3. Машинное отделение (engine_room)
```
Сердце корабля. В центре — главная консоль управления
системами. На экране мигает сообщение об ошибке:

> CRITICAL ERROR: powerSystem.activate() is not defined
> Ship systems offline. Manual override required.

Терминал ждёт ввода команды.
```

Terminal Challenge:
```javascript
// Система питания отключена из-за отсутствующей функции.
// Напишите функцию powerSystem.activate(), которая
// возвращает true для восстановления питания.

// Ваш код:
powerSystem.activate = function() {
  // ???
}
```

Solution:
```javascript
powerSystem.activate = function() {
  return true;
}
```

### Quest Flow
```
[Cabin] ─── find flashlight ───→ [Corridor] ───→ [Engine Room]
                                                       │
                                               fix JS bug
                                                       │
                                                       ▼
                                              [Quest Complete!]
```

## Visual Style (Future)

### Color Palette
- **Primary**: Deep space blue (#0a192f)
- **Secondary**: Cyan (#64ffda)
- **Accent**: Orange (#f97316)
- **Danger**: Red (#ef4444)
- **Text**: Light gray (#e2e8f0)

### Typography
- Headers: Futuristic, tech-style font
- Body: Clean, readable monospace for terminals
- UI: Sans-serif for clarity

### Art Direction
- Sci-fi aesthetic
- Dark themes with glowing accents
- Pixel art or stylized illustrations for locations
- Minimalist UI with sharp edges
