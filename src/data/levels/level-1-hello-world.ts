import type { Level } from '../../types';

// ASCII Arts for locations
const CRYO_POD_ASCII = `
    ╔════════════════════════════════╗
    ║     CRYO-POD #7 [OFFLINE]      ║
    ╠════════════════════════════════╣
    ║   ┌──────────────────────┐     ║
    ║   │  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  │     ║
    ║   │  █ ░░░░░░░░░░░░░░ █  │     ║
    ║   │  █ ░░ СИСТЕМA ░░░ █  │     ║
    ║   │  █ ░░ OFFLINE ░░░ █  │     ║
    ║   │  █ ░░░░░░░░░░░░░░ █  │     ║
    ║   │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │     ║
    ║   └──────────────────────┘     ║
    ║         [TERMINAL]             ║
    ╚════════════════════════════════╝
`;

const CABIN_ASCII = `
    ╔════════════════════════════════╗
    ║       PERSONAL CABIN #7        ║
    ╠════════════════════════════════╣
    ║  ┌────┐    ┌─────────────┐     ║
    ║  │ШКАФ│    │    ═══      │     ║
    ║  │    │    │   [БЕД]     │     ║
    ║  └────┘    │    ═══      │     ║
    ║            └─────────────┘     ║
    ║  ┌────┐                        ║
    ║  │☕  │    ╔═══╗               ║
    ║  └────┘    ║ D ║ <- ДВЕРЬ      ║
    ║            ╚═══╝               ║
    ╚════════════════════════════════╝
`;

const CORRIDOR_ASCII = `
    ╔════════════════════════════════════════╗
    ║            MAIN CORRIDOR               ║
    ╠════════════════════════════════════════╣
    ║                                        ║
    ║  [КАЮТА]  ══════════════  [М.ОТД.]    ║
    ║     ↑          ⚡⚡⚡           ↓       ║
    ║     │      ОПАСНОСТЬ!         │       ║
    ║     │      ИСКРИТ!            │       ║
    ║     ●──────────────────────────●       ║
    ║           ВЫ ЗДЕСЬ                     ║
    ║                                        ║
    ║  [!] РУБИЛЬНИК ОБЕСТОЧЕН              ║
    ╚════════════════════════════════════════╝
`;

const ENGINE_ROOM_ASCII = `
    ╔════════════════════════════════════════╗
    ║         ENGINE ROOM [CRITICAL]         ║
    ╠════════════════════════════════════════╣
    ║                                        ║
    ║     ┌─────────────────────────┐        ║
    ║     │  ████████████████████   │        ║
    ║     │  █ MAIN TERMINAL    █   │        ║
    ║     │  █                  █   │        ║
    ║     │  █ > _              █   │        ║
    ║     │  █                  █   │        ║
    ║     │  ████████████████████   │        ║
    ║     └─────────────────────────┘        ║
    ║                                        ║
    ║  [!] POWER SYSTEM OFFLINE              ║
    ╚════════════════════════════════════════╝
`;

export const level1: Level = {
  id: 'level-1-hello-world',
  name: 'Level 1: Hello World',
  description: 'Корабль дрейфует. Энергия на нуле. Система жизнеобеспечения упала с ошибкой.',
  startLocation: 'cryo_pod',
  completionCondition: { hasFlag: 'power_restored' },
  author: 'Space Rangers Quest Team',
  version: '1.0.0',
  difficulty: 'beginner',
  tags: ['переменные', 'строки', 'сравнение', 'функции'],
  order: 1,
  completionMessage: 'Ты восстановил систему питания корабля "Синтаксис-7".',
  completionSummary: [
    'Переменные и присваивание',
    'Строковые значения и кавычки',
    'Строгое сравнение (===)',
    'Конкатенация строк',
    'Функции и return',
  ],
  locations: [
    // =====================================
    // LOCATION 1: Cryo Pod
    // =====================================
    {
      id: 'cryo_pod',
      name: 'Крио-капсула',
      asciiArt: CRYO_POD_ASCII,
      description: `Темнота. Холод. Перед глазами мерцает голограмма интерфейса.

Ты медленно приходишь в себя. Крышка крио-капсулы всё ещё закрыта — замок заблокирован из-за сбоя питания.

На встроенном терминале мигает курсор, ожидая ввода команды.`,
      lintComment: 'О, проснулся. А я надеялся, что этот баг сам рассосётся. Твои показатели жизнедеятельности выглядят как спагетти-код. Вылезай, пока не замёрз окончательно.',
      isCheckpoint: true,
      challenge: {
        id: 'cryo_lock',
        setup: `// [SHIP OS] Замок крио-капсулы
// Статус: ЗАБЛОКИРОВАНО

let lockStatus;

// Присвой переменной lockStatus значение "open"
// для разблокировки замка.

// Твой код:`,
        instruction: 'Присвой переменной lockStatus значение "open"',
        lintHint: 'Смотри сюда. Замок ожидает строковое значение статуса. Не перепутай кавычки, джуниор.',
        solutions: [
          {
            pattern: 'lockStatus\\s*=\\s*["\']open["\']\\s*;?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Надо же, скомпилировалось с первого раза. Наверное, повезло.',
          },
          {
            pattern: 'lockStatus\\s*=\\s*open\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'ReferenceError: open is not defined. Ты пытаешься присвоить переменную, которой не существует. Кавычки для кого придумали? RTFM!',
            errorType: 'runtime',
          },
          {
            pattern: 'lockStatus\\s*=\\s*["\']close["\']\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Серьёзно? Ты хочешь остаться здесь навечно? Значение должно быть "open", а не "close".',
            errorType: 'logic',
          },
          {
            pattern: 'lockStatus\\s*=\\s*["\']Open["\']\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'JavaScript чувствителен к регистру. "Open" !== "open". Попробуй ещё раз с маленькой буквы.',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'cryo_unlocked', value: true },
          { type: 'showMessage', target: '', value: 'Замок щёлкает. Крышка капсулы открывается.' },
        ],
      },
      exits: [
        {
          direction: 'выход',
          targetLocation: 'cabin',
          description: 'Выбраться из капсулы в каюту',
          requires: { hasFlag: 'cryo_unlocked' },
          lockedMessage: 'Крышка заблокирована. Нужно ввести команду в терминал.',
        },
      ],
    },

    // =====================================
    // LOCATION 2: Cabin
    // =====================================
    {
      id: 'cabin',
      name: 'Личная каюта',
      asciiArt: CABIN_ASCII,
      description: `Ты выпадаешь на пол каюты. Помещение захламлено — видимо, при аварии всё разлетелось.

На столе стоит старая кружка с чем-то подозрительным. В углу — шкаф с вещами.

Дверь в коридор слабо светится аварийной подсветкой.`,
      lintComment: 'Добро пожаловать в апартаменты класса "Люкс". Советую найти одежду, твой текущий armor class равен нулю.',
      isCheckpoint: true,
      objects: [
        {
          id: 'wardrobe',
          name: 'Шкаф',
          description: 'Металлический шкаф с личными вещами.',
          actions: [
            {
              id: 'open_wardrobe',
              text: 'Открыть шкаф и взять комбинезон',
              lintComment: 'Наконец-то. Хоть какая-то защита от космической радиации.',
              effects: [
                { type: 'addItem', target: 'engineer_suit', value: 'Комбинезон инженера' },
                { type: 'setMaxHp', target: '', value: 110 },
                { type: 'modifyHp', target: '', value: 10 },
              ],
              requires: { notHasItem: 'engineer_suit' },
              successMessage: 'Ты надеваешь комбинезон инженера. Чувствуешь себя защищённее. (+10 HP)',
            },
          ],
        },
        {
          id: 'mug',
          name: 'Кружка',
          description: 'Кружка с чем-то, что когда-то было кофе.',
          actions: [
            {
              id: 'drink_coffee',
              text: 'Выпить старый кофе',
              lintComment: 'Серьёзно? Этой жиже больше лет, чем фреймворку jQuery.',
              effects: [
                { type: 'modifyHp', target: '', value: -5 },
                { type: 'modifyFocus', target: '', value: 10 },
                { type: 'setFlag', target: 'drank_coffee' },
              ],
              requires: { notHasFlag: 'drank_coffee' },
              successMessage: 'Отвратительно... но бодрит. (-5 HP, +10 Focus)',
            },
          ],
        },
      ],
      challenge: {
        id: 'cabin_door',
        setup: `// [DOOR CONTROL] Панель доступа
// ID пользователя загружен из системы

let userId = 1337;
let accessGranted;

// Напиши условие: если userId строго равен 1337,
// то accessGranted должно стать true.

// Твой код:`,
        instruction: 'Используй строгое сравнение (===) для проверки userId',
        lintHint: 'Дверь старая. Она проверяет тип данных. Если введёшь число как строку — останешься здесь.',
        solutions: [
          {
            pattern: 'accessGranted\\s*=\\s*\\(?\\s*userId\\s*===\\s*1337\\s*\\)?\\s*;?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Правильно. Строгое сравнение — признак хорошего тона. Хотя для тебя это, наверное, случайность.',
          },
          {
            pattern: 'if\\s*\\(\\s*userId\\s*===\\s*1337\\s*\\)\\s*(\\{\\s*)?accessGranted\\s*=\\s*true\\s*;?(\\s*\\})?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Работает. Хотя можно было короче. Но ладно, зачёт.',
          },
          {
            pattern: 'accessGranted\\s*=\\s*\\(?\\s*userId\\s*==\\s*1337\\s*\\)?\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Нет-нет-нет. == — это нестрогое сравнение. Оно может привести к неожиданным результатам. Используй ===!',
            errorType: 'logic',
          },
          {
            pattern: 'accessGranted\\s*=\\s*true\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Хардкод? Серьёзно? Нужно ПРОВЕРИТЬ userId, а не просто присвоить true.',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'cabin_door_unlocked', value: true },
          { type: 'showMessage', target: '', value: 'Дверь разблокирована. Доступ в коридор открыт.' },
        ],
      },
      exits: [
        {
          direction: 'коридор',
          targetLocation: 'corridor',
          description: 'Выйти в коридор',
          requires: { hasFlag: 'cabin_door_unlocked' },
          lockedMessage: 'Дверь заблокирована. Нужно пройти авторизацию через терминал.',
        },
      ],
    },

    // =====================================
    // LOCATION 3: Corridor
    // =====================================
    {
      id: 'corridor',
      name: 'Главный коридор',
      asciiArt: CORRIDOR_ASCII,
      description: `Коридор длинный и тёмный. Аварийные лампы едва освещают путь.

Впереди, у входа в машинное отделение, искрит повреждённая панель. Идти напрямую — рискованно.

Рядом на стене — рубильник освещения. Если подать питание, искры прекратятся.`,
      lintComment: 'В системе освещения null вместо напряжения. Тебе придётся починить рубильник, если не хочешь на ощупь искать выход.',
      isCheckpoint: true,
      isDangerous: true,
      dangerAction: {
        id: 'run_through',
        text: 'Пробежать через искры (ОПАСНО!)',
        damage: 100,
        deathMessage: 'Электрический разряд прошёл через твоё тело. Системы жизнеобеспечения отключились.',
        lintDeathComment: 'Я же говорил. Ладно, откатываем коммит. Попробуй использовать мозг в следующий раз.',
      },
      challenge: {
        id: 'corridor_power',
        setup: `// [POWER CONTROL] Рубильник освещения
// Нужно соединить две цепи для подачи питания

let circuitA = "Power";
let circuitB = "On";

// Соедини эти две строки в переменную result,
// чтобы получилось "PowerOn"
// И не добавь пробелов случайно.

let result;
// Твой код:`,
        instruction: 'Используй конкатенацию строк (+) для соединения circuitA и circuitB',
        lintHint: 'Конкатенация строк. Первый класс программирования. Надеюсь, ты это осилишь.',
        solutions: [
          {
            pattern: 'result\\s*=\\s*circuitA\\s*\\+\\s*circuitB\\s*;?',
            isRegex: true,
            isCorrect: true,
            lintReaction: 'Питание восстановлено. Искры прекратились. Иногда ты меня удивляешь... в хорошем смысле.',
          },
          {
            pattern: 'result\\s*=\\s*["\']PowerOn["\']\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Хардкод строки? Нет. Нужно СОЕДИНИТЬ переменные circuitA и circuitB.',
            errorType: 'logic',
          },
          {
            pattern: 'result\\s*=\\s*circuitA\\s*\\+\\s*["\']\\s*["\']\\s*\\+\\s*circuitB\\s*;?',
            isRegex: true,
            isCorrect: false,
            lintReaction: 'Зачем пробел? Нужно "PowerOn", а не "Power On". Убери лишнее.',
            errorType: 'logic',
          },
        ],
        onComplete: [
          { type: 'setFlag', target: 'corridor_powered', value: true },
          { type: 'showMessage', target: '', value: 'Свет загорается. Искры прекращаются. Путь в машинное отделение открыт!' },
        ],
      },
      exits: [
        {
          direction: 'каюта',
          targetLocation: 'cabin',
          description: 'Вернуться в каюту',
        },
        {
          direction: 'машинное отделение',
          targetLocation: 'engine_room',
          description: 'Пройти в машинное отделение',
          requires: { hasFlag: 'corridor_powered' },
          lockedMessage: 'Путь заблокирован искрящей панелью. Нужно починить рубильник.',
        },
      ],
    },

    // =====================================
    // LOCATION 4: Engine Room (Final)
    // =====================================
    {
      id: 'engine_room',
      name: 'Машинное отделение',
      asciiArt: ENGINE_ROOM_ASCII,
      description: `Сердце корабля. В центре — главная консоль управления системами.

На экране мигает сообщение об ошибке:

> CRITICAL ERROR: powerSystem.activate() is not defined
> Ship systems offline. Manual override required.

Терминал ждёт ввода команды для восстановления питания.`,
      lintComment: 'Вот оно — ядро системы. Кто-то забыл определить функцию активации питания. Какой... сюрприз.',
      isCheckpoint: true,
      challenge: {
        id: 'final_power',
        setup: `// [SHIP CORE] Главный терминал
// CRITICAL: powerSystem.activate is not defined

const powerSystem = {};

// Определи функцию powerSystem.activate,
// которая возвращает true для восстановления питания.

// Твой код:`,
        instruction: 'Определи функцию powerSystem.activate, которая возвращает true',
        lintHint: 'Функция должна возвращать true. Это буквально одна строка кода. Если не справишься — я потеряю последнюю надежду на человечество.',
        sandbox: {
          context: { powerSystem: {} },
          validate: 'typeof powerSystem.activate === "function" && powerSystem.activate() === true',
          successReaction: 'Невероятно. Ты действительно справился. Система питания восстановлена. Корабль снова функционирует.',
          failReaction: 'Функция powerSystem.activate должна существовать и возвращать true. Попробуй ещё.',
        },
        solutions: [],
        onComplete: [
          { type: 'setFlag', target: 'power_restored', value: true },
          { type: 'lintSay', target: '', value: 'Система питания восстановлена. Уровень пройден!' },
        ],
      },
      exits: [
        {
          direction: 'коридор',
          targetLocation: 'corridor',
          description: 'Вернуться в коридор',
        },
      ],
    },
  ],
};
