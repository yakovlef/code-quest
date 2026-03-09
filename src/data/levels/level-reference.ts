import type { Level } from '../../types';

// ===========================================
// ASCII ART
// ===========================================

const AIRLOCK_ASCII = `
    ╔═══════════════════════════════════════╗
    ║          AIRLOCK [BREACH MODE]        ║
    ╠═══════════════════════════════════════╣
    ║                                       ║
    ║   ┌──────┐      ┌──────────────┐     ║
    ║   │ ШЛЕМ │      │ ▓▓▓▓▓▓▓▓▓▓  │     ║
    ║   │  ⊙   │      │ ▓ SCANNER ▓  │     ║
    ║   └──────┘      │ ▓▓▓▓▓▓▓▓▓▓  │     ║
    ║                  └──────────────┘     ║
    ║   [CONSOLE]        [HATCH] →         ║
    ║                                       ║
    ╚═══════════════════════════════════════╝`;

const SERVER_ROOM_ASCII = `
    ╔═══════════════════════════════════════╗
    ║        SERVER ROOM [WARNING]         ║
    ╠═══════════════════════════════════════╣
    ║                                       ║
    ║   ███  ███  ███  ███  ███  ███       ║
    ║   █▒█  █▒█  █▒█  █▒█  █▒█  █▒█       ║
    ║   █▒█  █▒█  █▒█  █▒█  █▒█  █▒█       ║
    ║   ███  ███  ███  ███  ███  ███       ║
    ║        [SERVER RACKS]                 ║
    ║                                       ║
    ║   ┌──────────────────────────┐       ║
    ║   │  TERMINAL  > _           │       ║
    ║   └──────────────────────────┘       ║
    ╚═══════════════════════════════════════╝`;

const SECURITY_CORRIDOR_ASCII = `
    ╔═══════════════════════════════════════════╗
    ║       SECURITY CORRIDOR [LOCKED]          ║
    ╠═══════════════════════════════════════════╣
    ║                                           ║
    ║   [СЕРВЕРНАЯ] ←──── ⚠ ЛАЗЕРЫ ⚠ ────→ [АРХИВ] ║
    ║                         │                 ║
    ║                    ┌────┴────┐            ║
    ║                    │ ПУЛЬТ   │            ║
    ║                    │ ▓▓▓▓▓▓  │            ║
    ║                    └─────────┘            ║
    ║                                           ║
    ║   [!] ЛАЗЕРНАЯ СЕТКА АКТИВНА             ║
    ╚═══════════════════════════════════════════╝`;

const SECURITY_CORRIDOR_UNLOCKED_ASCII = `
    ╔═══════════════════════════════════════════╗
    ║       SECURITY CORRIDOR [UNLOCKED]        ║
    ╠═══════════════════════════════════════════╣
    ║                                           ║
    ║   [СЕРВЕРНАЯ] ←────────────────→ [АРХИВ]  ║
    ║                         │                 ║
    ║                    ┌────┴────┐            ║
    ║                    │ ПУЛЬТ   │            ║
    ║                    │ ▓▓▓▓▓▓  │            ║
    ║                    └─────────┘            ║
    ║                                           ║
    ║   [✓] ЛАЗЕРНАЯ СЕТКА ОТКЛЮЧЕНА           ║
    ╚═══════════════════════════════════════════╝`;

const DATA_ARCHIVE_ASCII = `
    ╔═══════════════════════════════════════╗
    ║       DATA ARCHIVE [ENCRYPTED]       ║
    ╠═══════════════════════════════════════╣
    ║                                       ║
    ║   ┌─────────────────────────────┐    ║
    ║   │  ╔══════════════════════╗   │    ║
    ║   │  ║  DATA CORE          ║   │    ║
    ║   │  ║  ████████░░░ 73%    ║   │    ║
    ║   │  ║  STATUS: LOCKED     ║   │    ║
    ║   │  ╚══════════════════════╝   │    ║
    ║   └─────────────────────────────┘    ║
    ║                                       ║
    ║   [ЯЩИК]    [TERMINAL]   [ШКАФ]     ║
    ╚═══════════════════════════════════════╝`;

const DATA_ARCHIVE_DECRYPTED_ASCII = `
    ╔═══════════════════════════════════════╗
    ║       DATA ARCHIVE [DECRYPTED]       ║
    ╠═══════════════════════════════════════╣
    ║                                       ║
    ║   ┌─────────────────────────────┐    ║
    ║   │  ╔══════════════════════╗   │    ║
    ║   │  ║  DATA CORE          ║   │    ║
    ║   │  ║  ████████████ 100%  ║   │    ║
    ║   │  ║  STATUS: UNLOCKED   ║   │    ║
    ║   │  ╚══════════════════════╝   │    ║
    ║   └─────────────────────────────┘    ║
    ║                                       ║
    ║   [ЯЩИК]    [TERMINAL]   [ШКАФ]     ║
    ╚═══════════════════════════════════════╝`;

const COMMAND_CENTER_ASCII = `
    ╔═══════════════════════════════════════════╗
    ║       COMMAND CENTER [FINAL]              ║
    ╠═══════════════════════════════════════════╣
    ║                                           ║
    ║        ┌───────────────────────┐          ║
    ║        │  ██████████████████   │          ║
    ║        │  █ MAIN CONSOLE   █   │          ║
    ║        │  █                █   │          ║
    ║        │  █ > _            █   │          ║
    ║        │  █                █   │          ║
    ║        │  ██████████████████   │          ║
    ║        └───────────────────────┘          ║
    ║                                           ║
    ║   [!] ТРЕБУЕТСЯ ЭКСТРАКЦИЯ ДАННЫХ        ║
    ╚═══════════════════════════════════════════╝`;

// ===========================================
// REFERENCE LEVEL — DATA BREACH
// ===========================================
// Demonstrates ALL engine features:
// - All EffectTypes: addItem, removeItem, modifyHp, modifyFocus,
//   setMaxHp, setMaxFocus, setFlag, removeFlag, teleport, showMessage, lintSay, completeChallenge
// - All Condition types: hasItem, notHasItem, hasFlag, notHasFlag,
//   minHp, maxHp, minFocus, challengeCompleted
// - InteractiveObject with appearsWhen, isHidden
// - DangerAction (death)
// - onEnter effects
// - Challenges: regex + exact match
// - Multiple solutions (correct + incorrect)
// - All 5 L.I.N.T. moods
// - Items with effects
// - Custom initialHp/initialFocus
// - completionCondition, completionMessage, completionSummary

export const levelReference: Level = {
  id: 'level-ref-data-breach',
  name: 'Reference: Data Breach',
  description: 'Эталонный уровень. Проникновение на вражескую станцию "Обливион" для экстракции похищенных данных.',
  startLocation: 'airlock',
  completionCondition: { hasFlag: 'data_extracted' },
  author: 'Space Rangers Quest Team',
  version: '1.0.0',
  difficulty: 'intermediate',
  tags: ['массивы', 'условия', 'объекты', 'методы'],
  order: 10,
  completionMessage: 'Данные успешно извлечены со станции "Обливион". Миссия выполнена.',
  completionSummary: [
    'Массивы и индексация',
    'Условные конструкции (if/else)',
    'Объекты и свойства',
    'Методы массивов (filter)',
    'Логические операторы',
  ],
  initialHp: 80,
  initialMaxHp: 80,
  initialFocus: 30,
  initialMaxFocus: 60,

  locations: [
    // =====================================
    // LOCATION 1: Airlock (Start)
    // =====================================
    {
      id: 'airlock',
      name: 'Шлюзовая камера',
      asciiArt: AIRLOCK_ASCII,
      description: `Ты проникаешь на станцию "Обливион" через аварийный шлюз. Воздух тонкий — система жизнеобеспечения работает на минимуме.

На стене висит скафандровый шлем с кислородным модулем. Рядом — сканер доступа, мигающий красным.

Консоль шлюза требует ввод кода для разгерметизации внутреннего люка.`,
      lintComment: 'Станция "Обливион". Судя по трафику данных — здесь хранятся наши файлы. Давай не задерживаться.',
      isCheckpoint: true,
      // DEMO: onEnter effects
      onEnter: [
        { type: 'lintSay', target: '', value: 'Сканирую периметр... Охрана минимальна. Действуй быстро.' },
        { type: 'modifyFocus', target: '', value: 5 },
      ],
      objects: [
        {
          id: 'helmet',
          name: 'Скафандровый шлем',
          description: 'Шлем с кислородным модулем. Добавит защиту.',
          actions: [
            {
              id: 'take_helmet',
              text: 'Надеть шлем',
              lintComment: 'Кислородный модуль. Плюс к здоровью. Элементарная предосторожность.',
              effects: [
                // DEMO: addItem
                { type: 'addItem', target: 'space_helmet', value: 'Скафандровый шлем' },
                // DEMO: setMaxHp
                { type: 'setMaxHp', target: '', value: 100 },
                // DEMO: modifyHp
                { type: 'modifyHp', target: '', value: 20 },
                // DEMO: setFlag
                { type: 'setFlag', target: 'has_helmet' },
              ],
              // DEMO: requires with notHasItem
              requires: { notHasItem: 'space_helmet' },
              successMessage: 'Шлем надет. Кислородный модуль активирован. MaxHP увеличен до 100. (+20 HP)',
            },
          ],
        },
        {
          id: 'scanner',
          name: 'Сканер доступа',
          description: 'Биометрический сканер. Мигает красным.',
          actions: [
            {
              id: 'hack_scanner',
              text: 'Взломать сканер',
              lintComment: 'Этот сканер видел лучшие дни. Попробуй.',
              effects: [
                { type: 'setFlag', target: 'scanner_hacked' },
                // DEMO: modifyFocus (negative)
                { type: 'modifyFocus', target: '', value: -10 },
                { type: 'showMessage', target: '', value: 'Сканер взломан. Данные сенсоров доступны. (-10 Focus)' },
              ],
              // DEMO: requires with notHasFlag + minFocus
              requires: { notHasFlag: 'scanner_hacked', minFocus: 15 },
              failMessage: 'Недостаточно концентрации для взлома сканера.',
              successMessage: 'Сканер взломан! Ты получаешь доступ к данным сенсоров станции.',
            },
          ],
        },
      ],
      // DEMO: challenge with regex + multiple correct/incorrect solutions
      challenge: {
        id: 'airlock_code',
        setup: `// [AIRLOCK CONTROL] Код разгерметизации
// Массив кодов доступа найден в памяти сканера

let codes = [12, 42, 7, 99, 42, 15];

// Найди элемент массива с индексом 3.
// Присвой его переменной accessCode.

let accessCode;
// Твой код:`,
        instruction: 'Присвой переменной accessCode элемент массива codes с индексом 3',
        lintHint: 'Массивы индексируются с нуля. Элемент с индексом 3 — это четвёртый элемент. Не перепутай.',
        solutions: [
          {
            pattern: 'accessCode\\s*=\\s*codes\\[3\\]\\s*;?',
            isRegex: true,
            isCorrect: true,
            // DEMO: L.I.N.T. mood "impressed"
            lintReaction: 'Верно. codes[3] === 99. Шлюз открывается.',
          },
          {
            pattern: 'accessCode\\s*=\\s*99\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Хардкод? Нет. Используй индексацию массива: codes[3].',
            errorType: 'logic',
          },
          {
            pattern: 'accessCode\\s*=\\s*codes\\[4\\]\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'codes[4] — это 42, а не 99. Индексация с нуля: 0→12, 1→42, 2→7, 3→99.',
            errorType: 'logic',
          },
          {
            pattern: 'accessCode\\s*=\\s*codes\\(3\\)\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Круглые скобки — это вызов функции. Для доступа к элементу массива используй квадратные скобки: codes[3].',
            errorType: 'syntax',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'airlock_opened', value: true },
          { type: 'showMessage', target: '', value: 'Код принят. Внутренний люк разгерметизирован.' },
        ],
      },
      exits: [
        {
          direction: 'серверная',
          targetLocation: 'server_room',
          description: 'Войти на станцию через внутренний люк',
          // DEMO: requires with hasFlag
          requires: { hasFlag: 'airlock_opened' },
          lockedMessage: 'Люк заблокирован. Введи код доступа в консоль.',
        },
      ],
    },

    // =====================================
    // LOCATION 2: Server Room
    // =====================================
    {
      id: 'server_room',
      name: 'Серверная',
      asciiArt: SERVER_ROOM_ASCII,
      description: `Ряды серверных стоек гудят в полумраке. Индикаторы мигают хаотично — система перегружена.

На одном из серверов — терминал с мигающим курсором. На полу валяется USB-модуль с чьими-то данными.

Дальше по коридору видна лазерная сетка безопасности.`,
      lintComment: 'Серверная. Данные где-то здесь, но сначала нужно разобраться с системой. И с лазерами впереди.',
      isCheckpoint: true,
      objects: [
        {
          id: 'usb_module',
          name: 'USB-модуль',
          description: 'Модуль с чьими-то данными. Может пригодиться.',
          actions: [
            {
              id: 'take_usb',
              text: 'Подобрать USB-модуль',
              lintComment: 'Чужие данные? Пригодится для расшифровки архива. Бери.',
              effects: [
                { type: 'addItem', target: 'usb_module', value: 'USB-модуль с данными' },
                { type: 'setFlag', target: 'has_usb' },
              ],
              requires: { notHasItem: 'usb_module' },
              successMessage: 'USB-модуль добавлен в инвентарь.',
            },
          ],
        },
        {
          id: 'medkit',
          name: 'Аптечка',
          description: 'Настенная аптечка первой помощи.',
          // DEMO: isHidden + appearsWhen (appears after scanning)
          isHidden: true,
          appearsWhen: { hasFlag: 'scanner_hacked' },
          actions: [
            {
              id: 'use_medkit',
              text: 'Использовать аптечку',
              lintComment: 'Стандартная аптечка. Восстановит немного здоровья.',
              effects: [
                { type: 'modifyHp', target: '', value: 15 },
                { type: 'setFlag', target: 'medkit_used' },
              ],
              requires: { notHasFlag: 'medkit_used' },
              successMessage: 'Аптечка использована. (+15 HP)',
            },
          ],
        },
        {
          id: 'energy_drink',
          name: 'Энергетик',
          description: 'Банка NullPointer Energy. Сомнительного качества.',
          actions: [
            {
              id: 'drink_energy',
              text: 'Выпить энергетик',
              lintComment: 'NullPointer Energy — "Ловим исключения, не ловим сон". Серьёзно?',
              effects: [
                // DEMO: setMaxFocus
                { type: 'setMaxFocus', target: '', value: 80 },
                { type: 'modifyFocus', target: '', value: 20 },
                { type: 'modifyHp', target: '', value: -5 },
                { type: 'setFlag', target: 'drank_energy' },
              ],
              requires: { notHasFlag: 'drank_energy' },
              successMessage: 'Отвратительно, но бодрит! MaxFocus увеличен до 80. (+20 Focus, -5 HP)',
            },
          ],
        },
      ],
      challenge: {
        id: 'server_access',
        setup: `// [SERVER CONTROL] Доступ к серверу
// Система требует проверку статуса

let serverStatus = "active";
let isSecure = false;
let accessLevel = 3;

// Напиши условие: если serverStatus равен "active"
// И accessLevel больше или равен 3,
// то isSecure должно стать true.

// Твой код:`,
        instruction: 'Используй if с условием: serverStatus === "active" && accessLevel >= 3',
        lintHint: 'Два условия. Логическое И. Если оба верны — ставишь isSecure = true. Это базовый if.',
        solutions: [
          {
            pattern: 'if\\s*\\(\\s*serverStatus\\s*===?\\s*["\']active["\']\\s*&&\\s*accessLevel\\s*>=\\s*3\\s*\\)\\s*\\{?\\s*isSecure\\s*=\\s*true;?\\s*\\}?',
            isRegex: true,
            isCorrect: true,
            // DEMO: L.I.N.T. mood "neutral"
            lintReaction: 'Условие выполнено. Сервер предоставляет доступ.',
          },
          {
            pattern: 'if\\s*\\(\\s*accessLevel\\s*>=\\s*3\\s*&&\\s*serverStatus\\s*===?\\s*["\']active["\']\\s*\\)\\s*\\{?\\s*isSecure\\s*=\\s*true;?\\s*\\}?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Порядок условий другой, но работает. Доступ получен.',
          },
          {
            pattern: 'isSecure\\s*=\\s*true\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Нужна ПРОВЕРКА условий через if, а не просто присваивание. Без проверки это дыра в безопасности.',
            errorType: 'logic',
          },
          {
            pattern: 'if\\s*\\(\\s*serverStatus\\s*===?\\s*["\']active["\']\\s*\\|\\|\\s*accessLevel\\s*>=\\s*3\\s*\\)',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Ты используешь ИЛИ (||) вместо И (&&). Нужно чтобы ОБА условия были истинны.',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'server_accessed' },
          { type: 'showMessage', target: '', value: 'Доступ к серверу получен! Путь к архиву данных открыт.' },
          // DEMO: lintSay effect with specific message
          { type: 'lintSay', target: '', value: 'Неплохо. Сервер наш. Двигаемся к архиву.' },
        ],
      },
      exits: [
        {
          direction: 'шлюз',
          targetLocation: 'airlock',
          description: 'Вернуться к шлюзу',
        },
        {
          direction: 'коридор безопасности',
          targetLocation: 'security_corridor',
          description: 'Пройти к коридору безопасности',
          // DEMO: requires with challengeCompleted
          requires: { challengeCompleted: 'server_access' },
          lockedMessage: 'Дверь заблокирована. Нужно получить доступ к серверу.',
        },
      ],
    },

    // =====================================
    // LOCATION 3: Security Corridor
    // =====================================
    {
      id: 'security_corridor',
      name: 'Коридор безопасности',
      asciiArt: SECURITY_CORRIDOR_ASCII,
      asciiArtUpdates: [
        { condition: { hasFlag: 'lasers_disabled' }, asciiArt: SECURITY_CORRIDOR_UNLOCKED_ASCII },
      ],
      description: `Узкий коридор перегорожен лазерной сеткой. Красные лучи пересекают проход — пройти невозможно.

На стене — пульт управления сеткой. Экран показывает массив частот лазеров.

За сеткой виден вход в архив данных.`,
      descriptionUpdates: [
        {
          condition: { hasFlag: 'lasers_disabled' },
          description: `Коридор безопасности. Лазерная сетка отключена — путь свободен.

На стене — пульт управления сеткой. Экран показывает: "СИСТЕМА ОТКЛЮЧЕНА".

Впереди — вход в архив данных.`,
        },
      ],
      lintComment: 'Лазерная сетка. Классика. Не советую проверять на себе — это не инфракрасные датчики из кино.',
      isCheckpoint: true,
      // DEMO: isDangerous + dangerAction
      isDangerous: true,
      dangerAction: {
        id: 'walk_through_lasers',
        text: 'Пройти через лазерную сетку (СМЕРТЕЛЬНО!)',
        damage: 200,
        deathMessage: 'Лазерная сетка разрезала тебя на аккуратные кубики. Система безопасности работает исправно.',
        // DEMO: L.I.N.T. mood "angry"
        lintDeathComment: 'Я БУКВАЛЬНО сказал не лезть. Ладно, git revert... Какой же ты баг в моей жизни.',
        showWhen: { notHasFlag: 'lasers_disabled' },
      },
      challenge: {
        id: 'laser_grid',
        setup: `// [SECURITY GRID] Управление лазерной сеткой
// Массив частот лазеров (в MHz)

let frequencies = [120, 450, 80, 300, 90, 510, 60, 200];

// Отфильтруй массив: оставь только частоты НИЖЕ 100.
// Это отключит высокочастотные лазеры.

let safePaths;
// Твой код:`,
        instruction: 'Используй метод .filter() для фильтрации массива frequencies — оставь только значения < 100',
        lintHint: 'Array.filter(). Передай callback, который возвращает true для элементов меньше 100. Элементарно.',
        solutions: [
          {
            pattern: 'safePaths\\s*=\\s*frequencies\\.filter\\(\\s*(?:function\\s*\\(\\s*\\w+\\s*\\)\\s*\\{\\s*return\\s+\\w+\\s*<\\s*100\\s*;?\\s*\\}|\\(?\\s*\\w+\\s*\\)?\\s*=>\\s*\\w+\\s*<\\s*100)\\s*\\)\\s*;?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Лазеры отключены. Путь свободен. [80, 90, 60] — три безопасных коридора.',
          },
          {
            // DEMO: exact match solution
            pattern: 'safePaths = frequencies.filter(f => f < 100)',
            isRegex: false,
            isCorrect: true,
            // DEMO: L.I.N.T. mood "sarcastic"
            lintReaction: 'Кратко и по делу. Стрелочные функции — выбор профессионалов. Или лентяев. Впрочем, это одно и то же.',
          },
          {
            pattern: 'safePaths\\s*=\\s*frequencies\\.filter\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>\\s*\\w+\\s*>\\s*100\\s*\\)\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Ты отфильтровал частоты ВЫШЕ 100. Нужно наоборот — НИЖЕ 100. Поменяй знак.',
            errorType: 'logic',
          },
          {
            pattern: 'safePaths\\s*=\\s*frequencies\\.map\\(',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'map() преобразует элементы, а не фильтрует. Тебе нужен filter().',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'lasers_disabled' },
          { type: 'showMessage', target: '', value: 'Лазерная сетка отключена! Путь в архив данных свободен.' },
        ],
      },
      exits: [
        {
          direction: 'серверная',
          targetLocation: 'server_room',
          description: 'Вернуться в серверную',
        },
        {
          direction: 'архив данных',
          targetLocation: 'data_archive',
          description: 'Пройти в архив данных',
          requires: { hasFlag: 'lasers_disabled' },
          lockedMessage: 'Лазерная сетка блокирует проход. Отключи её через пульт.',
        },
      ],
    },

    // =====================================
    // LOCATION 4: Data Archive
    // =====================================
    {
      id: 'data_archive',
      name: 'Архив данных',
      asciiArt: DATA_ARCHIVE_ASCII,
      asciiArtUpdates: [
        { condition: { hasFlag: 'archive_challenge_done' }, asciiArt: DATA_ARCHIVE_DECRYPTED_ASCII },
      ],
      description: `Архив данных. В центре — ядро хранения данных, окружённое защитным полем.

На экране: "STATUS: LOCKED — ТРЕБУЕТСЯ КЛЮЧ РАСШИФРОВКИ".

В углу стоит ящик с инструментами. На стене — шкаф с оборудованием.`,
      descriptionUpdates: [
        {
          condition: { hasFlag: 'archive_challenge_done' },
          description: `Архив данных. Ядро хранения данных расшифровано — защитное поле снято.

На экране: "STATUS: UNLOCKED — ДАННЫЕ ДОСТУПНЫ".

В углу стоит ящик с инструментами. На стене — шкаф с оборудованием.`,
        },
      ],
      lintComment: 'Вот оно — ядро данных. Зашифровано. Нужен ключ расшифровки. Осмотрись.',
      isCheckpoint: true,
      // DEMO: onEnter with conditional lintSay
      onEnter: [
        { type: 'showMessage', target: '', value: 'Ты входишь в архив данных. Воздух холодный — системы охлаждения работают на полную.' },
      ],
      objects: [
        {
          id: 'toolbox',
          name: 'Ящик с инструментами',
          description: 'Набор инструментов для обслуживания серверов.',
          actions: [
            {
              id: 'take_tools',
              text: 'Взять набор инструментов',
              lintComment: 'Серверные инструменты. Могут пригодиться для извлечения данных.',
              effects: [
                { type: 'addItem', target: 'server_tools', value: 'Серверные инструменты' },
              ],
              requires: { notHasItem: 'server_tools' },
              successMessage: 'Набор серверных инструментов добавлен в инвентарь.',
            },
          ],
        },
        {
          id: 'equipment_cabinet',
          name: 'Шкаф с оборудованием',
          description: 'Шкаф с различным сетевым оборудованием.',
          actions: [
            {
              id: 'search_cabinet',
              text: 'Обыскать шкаф',
              lintComment: 'Стандартное сетевое оборудование... О, а это что?',
              effects: [
                { type: 'addItem', target: 'crypto_key', value: 'Ключ расшифровки' },
                { type: 'setFlag', target: 'has_crypto_key' },
                { type: 'showMessage', target: '', value: 'Найден ключ расшифровки! Кто-то оставил его в шкафу...' },
              ],
              requires: { notHasFlag: 'has_crypto_key' },
              successMessage: 'В шкафу найден ключ расшифровки!',
            },
            {
              id: 'search_again',
              text: 'Осмотреть шкаф ещё раз',
              lintComment: 'Больше ничего интересного. Не жадничай.',
              effects: [
                { type: 'showMessage', target: '', value: 'Шкаф пуст. Больше ничего полезного.' },
              ],
              requires: { hasFlag: 'has_crypto_key' },
              successMessage: 'Шкаф пуст.',
            },
          ],
        },
        {
          id: 'data_core_panel',
          name: 'Панель ядра данных',
          description: 'Интерфейс для подключения к ядру данных.',
          // DEMO: appearsWhen with hasItem
          appearsWhen: { hasItem: 'crypto_key' },
          actions: [
            {
              id: 'decrypt_core',
              text: 'Расшифровать ядро данных',
              lintComment: 'Подключаю ключ... Шифрование снято. Теперь нужно извлечь данные через терминал.',
              effects: [
                { type: 'setFlag', target: 'core_decrypted' },
                // DEMO: removeItem
                { type: 'removeItem', target: 'crypto_key' },
                { type: 'showMessage', target: '', value: 'Ключ использован. Ядро расшифровано! Теперь используй USB-модуль для копирования.' },
              ],
              // DEMO: requires with hasItem + hasFlag
              requires: { hasItem: 'crypto_key', notHasFlag: 'core_decrypted' },
              successMessage: 'Ядро данных расшифровано!',
            },
            {
              id: 'copy_data',
              text: 'Скопировать данные на USB-модуль',
              lintComment: 'Копирование данных... 73%... 89%... 100%. Данные на модуле.',
              effects: [
                { type: 'setFlag', target: 'data_copied' },
                { type: 'removeItem', target: 'usb_module' },
                { type: 'addItem', target: 'usb_with_data', value: 'USB-модуль с извлечёнными данными' },
                { type: 'lintSay', target: '', value: 'Данные скопированы! Теперь в командный центр для финальной передачи.' },
              ],
              // DEMO: requires with hasItem + hasFlag combination
              requires: { hasItem: 'usb_module', hasFlag: 'core_decrypted' },
              failMessage: 'Нужен USB-модуль для копирования данных.',
              successMessage: 'Данные скопированы на USB-модуль!',
            },
          ],
        },
      ],
      challenge: {
        id: 'archive_decrypt',
        setup: `// [DATA CORE] Система расшифровки
// Данные хранятся в виде объекта

let dataPacket = {
  id: "OBL-7742",
  type: "classified",
  encrypted: true,
  size: 2048
};

// Создай новый объект decryptedPacket
// со всеми свойствами dataPacket,
// но измени encrypted на false.

let decryptedPacket;
// Твой код:`,
        instruction: 'Создай копию объекта dataPacket через spread-оператор и измени encrypted на false',
        lintHint: 'Spread-оператор {...obj} копирует свойства. Потом переопределяешь нужное. Не мутируй оригинал.',
        solutions: [
          {
            pattern: 'decryptedPacket\\s*=\\s*\\{\\s*\\.\\.\\.dataPacket\\s*,\\s*encrypted\\s*:\\s*false\\s*\\}\\s*;?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Идеально. Spread + override. Иммутабельность — признак зрелого разработчика.',
          },
          {
            pattern: 'decryptedPacket\\s*=\\s*Object\\.assign\\(\\s*\\{\\}\\s*,\\s*dataPacket\\s*,\\s*\\{\\s*encrypted\\s*:\\s*false\\s*\\}\\s*\\)\\s*;?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Object.assign? Олдскул, но работает. Данные расшифрованы.',
          },
          {
            pattern: 'Object\\.assign\\(\\s*dataPacket',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Object.assign(dataPacket, ...) мутирует оригинал! Первым аргументом должен быть пустой объект: Object.assign({}, dataPacket, {encrypted: false}).',
            errorType: 'logic',
          },
          {
            pattern: 'dataPacket\\.encrypted\\s*=\\s*false\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Ты мутировал оригинальный объект! Нужно создать НОВЫЙ объект decryptedPacket.',
            errorType: 'logic',
          },
          {
            pattern: 'decryptedPacket\\s*=\\s*dataPacket\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Это не копия — это ссылка на тот же объект. Используй spread: {...dataPacket, encrypted: false}.',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'archive_challenge_done' },
          // DEMO: completeChallenge effect
          { type: 'completeChallenge', target: 'archive_decrypt' },
          { type: 'showMessage', target: '', value: 'Данные расшифрованы! Командный центр разблокирован.' },
        ],
      },
      exits: [
        {
          direction: 'коридор',
          targetLocation: 'security_corridor',
          description: 'Вернуться в коридор безопасности',
        },
        {
          direction: 'командный центр',
          targetLocation: 'command_center',
          description: 'Перейти в командный центр',
          // DEMO: requires with multiple conditions
          requires: { hasFlag: 'archive_challenge_done', hasItem: 'usb_with_data' },
          lockedMessage: 'Нужно расшифровать данные и скопировать их на USB-модуль.',
        },
      ],
    },

    // =====================================
    // LOCATION 5: Command Center (Final)
    // =====================================
    {
      id: 'command_center',
      name: 'Командный центр',
      asciiArt: COMMAND_CENTER_ASCII,
      description: `Командный центр станции "Обливион". Главная консоль управления занимает всю стену.

На экране — интерфейс передачи данных. USB-модуль с данными готов к подключению.

Осталось написать команду экстракции — и данные будут переданы на твой корабль.`,
      lintComment: 'Финальный рывок. Подключай модуль и пиши команду передачи. Не облажайся на финишной прямой.',
      isCheckpoint: true,
      // DEMO: onEnter with removeFlag (removing old flag)
      onEnter: [
        { type: 'removeFlag', target: 'archive_challenge_done' },
        { type: 'lintSay', target: '', value: 'Мы внутри. Одна команда — и данные наши. Не подведи.' },
      ],
      objects: [
        {
          id: 'emergency_kit',
          name: 'Экстренная аптечка',
          description: 'Аптечка с мощным стимулятором.',
          // DEMO: appearsWhen with maxHp condition (appears only if HP is low)
          appearsWhen: { maxHp: 50 },
          actions: [
            {
              id: 'use_emergency_kit',
              text: 'Использовать экстренную аптечку',
              lintComment: 'Стимулятор. Полное восстановление. Используй с умом.',
              effects: [
                { type: 'modifyHp', target: '', value: 50 },
                { type: 'modifyFocus', target: '', value: 20 },
                { type: 'setFlag', target: 'emergency_used' },
              ],
              requires: { notHasFlag: 'emergency_used' },
              successMessage: 'Стимулятор введён. (+50 HP, +20 Focus)',
            },
          ],
        },
      ],
      challenge: {
        id: 'final_extraction',
        setup: `// [COMMAND CONSOLE] Экстракция данных
// USB-модуль подключён. Готов к передаче.

let usbData = {
  files: ["plans.dat", "codes.dat", "map.dat"],
  encrypted: false,
  target: "ship"
};

// Напиши условие: если usbData.encrypted === false
// И usbData.files.length > 0,
// установи переменную transmit = true

let transmit;
// Твой код:`,
        instruction: 'Проверь что данные не зашифрованы и файлы есть, затем установи transmit = true',
        lintHint: 'Два условия через &&. Проверяешь encrypted и длину массива. Последний шаг. Сосредоточься.',
        solutions: [
          {
            pattern: 'if\\s*\\(\\s*usbData\\.encrypted\\s*===\\s*false\\s*&&\\s*usbData\\.files\\.length\\s*>\\s*0\\s*\\)\\s*\\{?\\s*transmit\\s*=\\s*true;?\\s*\\}?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Передача завершена. Данные на корабле. Миссия выполнена. Даже я впечатлён.',
          },
          {
            pattern: 'if\\s*\\(\\s*!usbData\\.encrypted\\s*&&\\s*usbData\\.files\\.length\\s*>\\s*0\\s*\\)\\s*\\{?\\s*transmit\\s*=\\s*true;?\\s*\\}?',
            isRegex: true,
            isCorrect: true,
            lintReaction: '!encrypted — элегантно. Данные переданы. Мы сделали это.',
          },
          {
            pattern: 'if\\s*\\(\\s*usbData\\.files\\.length\\s*>\\s*0\\s*&&\\s*usbData\\.encrypted\\s*===\\s*false\\s*\\)\\s*\\{?\\s*transmit\\s*=\\s*true;?\\s*\\}?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Порядок другой, но логика верна. Данные переданы на корабль.',
          },
          {
            pattern: 'transmit\\s*=\\s*true\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Без проверки? Что если данные зашифрованы или файлов нет? Нужен if с условиями.',
            errorType: 'logic',
          },
          {
            pattern: 'if\\s*\\(\\s*usbData\\.encrypted\\s*===\\s*true',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Ты проверяешь что данные ЗАШИФРОВАНЫ. Нужно наоборот — encrypted === false.',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'data_extracted', value: true },
          { type: 'lintSay', target: '', value: 'МИССИЯ ВЫПОЛНЕНА. Все данные переданы. Уходим, пока не поздно.' },
          // DEMO: teleport effect
          { type: 'teleport', target: 'airlock' },
        ],
      },
      exits: [
        {
          direction: 'архив',
          targetLocation: 'data_archive',
          description: 'Вернуться в архив данных',
        },
      ],
    },
  ],
};
