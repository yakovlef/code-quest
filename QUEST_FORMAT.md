# Quest Format Specification

Стандарт описания уровней для Space Rangers Quest. Используется для создания community-уровней в формате JSON.

## Структура уровня (Level)

```json
{
  "id": "string (обязательно)",
  "name": "string (обязательно)",
  "description": "string (обязательно)",
  "startLocation": "string (обязательно, ID существующей локации)",
  "completionCondition": { "hasFlag": "flag_name" },
  "locations": [ ... ],

  "author": "string (опционально)",
  "version": "string (опционально)",
  "difficulty": "beginner | intermediate | advanced (опционально)",
  "tags": ["string", ...],
  "order": 100,
  "completionMessage": "Текст при завершении (опционально)",
  "completionSummary": ["Навык 1", "Навык 2"],
  "nextLevelId": "id следующего уровня (опционально)",
  "initialHp": 100,
  "initialMaxHp": 100,
  "initialFocus": 50,
  "initialMaxFocus": 50
}
```

### Обязательные поля

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | string | Уникальный идентификатор уровня |
| `name` | string | Название для отображения |
| `description` | string | Описание уровня |
| `startLocation` | string | ID стартовой локации |
| `completionCondition` | Condition | Условие завершения уровня |
| `locations` | Location[] | Массив локаций (минимум 1) |

---

## Локация (Location)

```json
{
  "id": "string (обязательно)",
  "name": "string (обязательно)",
  "description": "string (обязательно)",
  "lintComment": "string (обязательно, фраза L.I.N.T. при входе)",
  "exits": [ ... ],

  "asciiArt": "string (опционально, ASCII-арт)",
  "objects": [ ... ],
  "challenge": { ... },
  "isDangerous": false,
  "dangerAction": { ... },
  "onEnter": [ ... ],
  "isCheckpoint": false
}
```

### Поля локации

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | string | Да | Уникальный ID (уникален в рамках уровня) |
| `name` | string | Да | Название |
| `description` | string | Да | Текст описания |
| `lintComment` | string | Да | Что скажет L.I.N.T. при входе |
| `exits` | Exit[] | Да | Выходы (может быть пустым массивом) |
| `asciiArt` | string | Нет | ASCII-арт для визуальной панели |
| `objects` | InteractiveObject[] | Нет | Интерактивные объекты |
| `challenge` | Challenge | Нет | Кодинг-задача |
| `isDangerous` | boolean | Нет | Есть ли опасное действие |
| `dangerAction` | DangerAction | Нет | Параметры опасного действия |
| `onEnter` | Effect[] | Нет | Эффекты при входе |
| `isCheckpoint` | boolean | Нет | Точка сохранения (респавн) |

---

## Выход (Exit)

```json
{
  "direction": "коридор",
  "targetLocation": "corridor_id",
  "description": "Пройти в коридор",
  "requires": { "hasFlag": "door_unlocked" },
  "lockedMessage": "Дверь заблокирована."
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `direction` | string | Да | Текст на кнопке |
| `targetLocation` | string | Да | ID целевой локации |
| `description` | string | Да | Подсказка |
| `requires` | Condition | Нет | Условие для прохода |
| `lockedMessage` | string | Нет | Сообщение если заблокировано |

---

## Интерактивный объект (InteractiveObject)

```json
{
  "id": "wardrobe",
  "name": "Шкаф",
  "description": "Металлический шкаф.",
  "actions": [ ... ],
  "isHidden": true,
  "appearsWhen": { "hasFlag": "room_searched" }
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | string | Да | Уникальный ID |
| `name` | string | Да | Название |
| `description` | string | Да | Описание |
| `actions` | ObjectAction[] | Да | Доступные действия |
| `isHidden` | boolean | Нет | Скрыт ли объект по умолчанию |
| `appearsWhen` | Condition | Нет | Условие появления скрытого объекта |

---

## Действие объекта (ObjectAction)

```json
{
  "id": "open_door",
  "text": "Открыть дверь",
  "lintComment": "Наконец-то.",
  "effects": [
    { "type": "setFlag", "target": "door_opened" },
    { "type": "modifyHp", "target": "", "value": -5 }
  ],
  "requires": { "hasItem": "keycard" },
  "failMessage": "Нужна ключ-карта.",
  "successMessage": "Дверь открыта."
}
```

---

## Задача (Challenge)

```json
{
  "id": "fix_power",
  "setup": "// Код, показываемый в терминале\nlet x;",
  "instruction": "Присвой x значение 42",
  "lintHint": "Подсказка от L.I.N.T.",
  "solutions": [ ... ],
  "onComplete": [
    { "type": "setFlag", "target": "power_fixed", "value": true }
  ]
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `id` | string | Да | Уникальный ID задачи |
| `setup` | string | Да | Стартовый код в терминале |
| `instruction` | string | Да | Инструкция для игрока |
| `lintHint` | string | Да | Подсказка L.I.N.T. |
| `solutions` | Solution[] | Да | Массив решений (мин. 1) |
| `onComplete` | Effect[] | Да | Эффекты при правильном решении |

---

## Решение (Solution)

```json
{
  "pattern": "x\\s*=\\s*42\\s*;?",
  "isRegex": true,
  "isCorrect": true,
  "lintReaction": "Верно! Система починена.",
  "effects": [],
  "errorType": "logic"
}
```

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| `pattern` | string | Да | Regex-паттерн или точная строка |
| `isRegex` | boolean | Да | `true` = regex, `false` = exact match |
| `isCorrect` | boolean | Да | Правильное ли это решение |
| `lintReaction` | string | Да | Реакция L.I.N.T. |
| `effects` | Effect[] | Нет | Доп. эффекты (обычно для неправильных ответов) |
| `errorType` | string | Нет | `"syntax"`, `"logic"`, `"runtime"` |

### Как работают паттерны

- Решения проверяются **по порядку**, первое совпадение побеждает
- Для `isRegex: true` — паттерн проверяется через `new RegExp(pattern).test(input)`
- Для `isRegex: false` — точное совпадение (`input.trim() === pattern.trim()`)
- Если ни одно решение не совпало — L.I.N.T. выдаёт дефолтную ошибку

**Рекомендация:** ставьте правильные решения первыми, затем частые ошибки.

---

## Опасное действие (DangerAction)

```json
{
  "id": "touch_wire",
  "text": "Потрогать оголённый провод (ОПАСНО!)",
  "damage": 100,
  "deathMessage": "Электрический разряд убил тебя.",
  "lintDeathComment": "Я же предупреждал..."
}
```

---

## Условия (Condition)

Все поля опциональны. Если указано несколько — все должны быть выполнены (логическое И).

```json
{
  "hasItem": "keycard",
  "notHasItem": "broken_key",
  "hasFlag": "door_unlocked",
  "notHasFlag": "alarm_triggered",
  "minHp": 50,
  "maxHp": 80,
  "minFocus": 20,
  "challengeCompleted": "fix_power"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `hasItem` | string | У игрока есть предмет с этим ID |
| `notHasItem` | string | У игрока НЕТ предмета с этим ID |
| `hasFlag` | string | Флаг установлен (true) |
| `notHasFlag` | string | Флаг не установлен |
| `minHp` | number | HP >= значение |
| `maxHp` | number | HP <= значение |
| `minFocus` | number | Focus >= значение |
| `challengeCompleted` | string | Задача с этим ID пройдена |

---

## Эффекты (Effect)

```json
{ "type": "effectType", "target": "string", "value": "string | number | boolean" }
```

| Type | target | value | Описание |
|------|--------|-------|----------|
| `addItem` | ID предмета | Название предмета (string) | Добавить предмет |
| `removeItem` | ID предмета | — | Убрать предмет |
| `modifyHp` | — | число (+/-) | Изменить HP |
| `modifyFocus` | — | число (+/-) | Изменить Focus |
| `setMaxHp` | — | число | Установить макс HP |
| `setMaxFocus` | — | число | Установить макс Focus |
| `setFlag` | имя флага | true/false | Установить флаг |
| `removeFlag` | имя флага | — | Удалить флаг |
| `teleport` | ID локации | — | Переместить в локацию |
| `showMessage` | — | текст (string) | Показать сообщение в логе |
| `lintSay` | — | текст (string) | L.I.N.T. говорит |
| `completeChallenge` | ID задачи | — | Пометить задачу как пройденную |

---

## Правила валидации

При импорте JSON проверяется:

1. **Структура** — все обязательные поля присутствуют и имеют правильный тип
2. **Ссылочная целостность:**
   - `startLocation` → существующая локация
   - Все `exit.targetLocation` → существующие локации
   - Все `teleport` эффекты → существующие локации
3. **Уникальность** — нет дублей location ID и challenge ID
4. **Regex** — все паттерны с `isRegex: true` компилируются без ошибок
5. **completionCondition** — обязательно указано условие завершения

---

## Минимальный пример (1 локация)

```json
{
  "id": "example-minimal",
  "name": "Минимальный пример",
  "description": "Самый простой уровень с одной задачей.",
  "startLocation": "room",
  "completionCondition": { "hasFlag": "task_done" },
  "author": "YourName",
  "difficulty": "beginner",
  "tags": ["переменные"],
  "locations": [
    {
      "id": "room",
      "name": "Комната",
      "description": "Ты в комнате. На столе — терминал.",
      "lintComment": "Ну давай, покажи что умеешь.",
      "isCheckpoint": true,
      "challenge": {
        "id": "task1",
        "setup": "let answer;\n// Присвой answer значение 42",
        "instruction": "Присвой переменной answer значение 42",
        "lintHint": "Просто напиши: answer = 42",
        "solutions": [
          {
            "pattern": "answer\\s*=\\s*42\\s*;?",
            "isRegex": true,
            "isCorrect": true,
            "lintReaction": "Верно!"
          },
          {
            "pattern": "answer\\s*=\\s*\"42\"\\s*;?",
            "isRegex": true,
            "isCorrect": false,
            "lintReaction": "Это строка, а не число. Убери кавычки.",
            "errorType": "logic"
          }
        ],
        "onComplete": [
          { "type": "setFlag", "target": "task_done", "value": true }
        ]
      },
      "exits": []
    }
  ]
}
```

---

## Развёрнутый пример (3 локации)

```json
{
  "id": "example-full",
  "name": "Полный пример: Лаборатория",
  "description": "Трёхкомнатная лаборатория с предметами и опасностями.",
  "startLocation": "entrance",
  "completionCondition": { "hasFlag": "experiment_done" },
  "author": "CommunityDev",
  "version": "1.0.0",
  "difficulty": "intermediate",
  "tags": ["циклы", "массивы"],
  "order": 100,
  "completionMessage": "Эксперимент завершён!",
  "completionSummary": ["Циклы for", "Работа с массивами"],
  "initialHp": 80,
  "initialFocus": 40,
  "locations": [
    {
      "id": "entrance",
      "name": "Вход в лабораторию",
      "description": "Тёмный коридор ведёт в лабораторию.",
      "lintComment": "Лаборатория. Будь осторожен.",
      "isCheckpoint": true,
      "objects": [
        {
          "id": "flashlight",
          "name": "Фонарик",
          "description": "Фонарик на полке.",
          "actions": [
            {
              "id": "take_flashlight",
              "text": "Взять фонарик",
              "effects": [
                { "type": "addItem", "target": "flashlight", "value": "Фонарик" },
                { "type": "setFlag", "target": "has_light" }
              ],
              "requires": { "notHasItem": "flashlight" },
              "successMessage": "Фонарик добавлен в инвентарь."
            }
          ]
        }
      ],
      "exits": [
        {
          "direction": "лаборатория",
          "targetLocation": "lab",
          "description": "Войти в лабораторию",
          "requires": { "hasItem": "flashlight" },
          "lockedMessage": "Слишком темно. Нужен фонарик."
        }
      ]
    },
    {
      "id": "lab",
      "name": "Лаборатория",
      "description": "Научная лаборатория с оборудованием.",
      "lintComment": "Осторожно с реактивами.",
      "isCheckpoint": true,
      "isDangerous": true,
      "dangerAction": {
        "id": "drink_acid",
        "text": "Выпить зелёную жидкость (ОПАСНО!)",
        "damage": 999,
        "deathMessage": "Это была кислота.",
        "lintDeathComment": "Зачем. Просто зачем."
      },
      "challenge": {
        "id": "lab_task",
        "setup": "let samples = [10, 20, 30, 40, 50];\nlet sum = 0;\n// Посчитай сумму всех элементов через цикл for",
        "instruction": "Напиши цикл for для суммирования массива",
        "lintHint": "for (let i = 0; i < samples.length; i++) { sum += samples[i]; }",
        "solutions": [
          {
            "pattern": "for\\s*\\(",
            "isRegex": true,
            "isCorrect": true,
            "lintReaction": "Цикл работает. Сумма: 150."
          }
        ],
        "onComplete": [
          { "type": "setFlag", "target": "lab_done" },
          { "type": "addItem", "target": "lab_key", "value": "Ключ от хранилища" }
        ]
      },
      "exits": [
        {
          "direction": "вход",
          "targetLocation": "entrance",
          "description": "Вернуться ко входу"
        },
        {
          "direction": "хранилище",
          "targetLocation": "storage",
          "description": "Войти в хранилище",
          "requires": { "hasItem": "lab_key" },
          "lockedMessage": "Дверь заперта. Нужен ключ."
        }
      ]
    },
    {
      "id": "storage",
      "name": "Хранилище",
      "description": "Хранилище с данными эксперимента.",
      "lintComment": "Финальная комната. Заверши эксперимент.",
      "challenge": {
        "id": "storage_task",
        "setup": "let data = [1, 2, 3, 4, 5];\nlet doubled;\n// Создай новый массив doubled, где каждый элемент умножен на 2",
        "instruction": "Используй .map() для создания нового массива",
        "lintHint": "data.map(x => x * 2)",
        "solutions": [
          {
            "pattern": "doubled\\s*=\\s*data\\.map\\(",
            "isRegex": true,
            "isCorrect": true,
            "lintReaction": "Эксперимент завершён!"
          }
        ],
        "onComplete": [
          { "type": "setFlag", "target": "experiment_done", "value": true }
        ]
      },
      "exits": [
        {
          "direction": "лаборатория",
          "targetLocation": "lab",
          "description": "Вернуться в лабораторию"
        }
      ]
    }
  ]
}
```

---

## Как импортировать

1. Сохрани JSON-файл на диск (например, `my-level.json`)
2. Открой игру → экран выбора уровней
3. Нажми "Импорт уровня (JSON)"
4. Выбери файл
5. Если валидация пройдена — уровень появится в списке как "Community"
6. Импортированные уровни сохраняются в localStorage и переживают перезагрузку

## Как предложить уровень через PR

1. Создай JSON-файл по спецификации выше
2. Проверь что он проходит импорт в игре (нет ошибок валидации)
3. Открой Pull Request с файлом уровня
4. В описании PR укажи: тему обучения, сложность, количество локаций
