# Roadmap

## Phase 0: Frontend MVP — ✅ Done

Минимальная играбельная версия в браузере без бэкенда.

### Core
- [x] Vite + React + TypeScript
- [x] Tailwind CSS с кастомной sci-fi палитрой
- [x] Zustand store + LocalStorage persistence
- [x] QuickJS sandbox для выполнения кода

### UI
- [x] Двухколоночный Layout (VisualPanel + QuestPanel)
- [x] Terminal (ввод/вывод кода)
- [x] PlayerStats (HP, Focus)
- [x] L.I.N.T. avatar + dialogue (система настроений)
- [x] DeathScreen / respawn
- [x] LevelSelector / LevelCompleteScreen

### Quest Engine
- [x] Level loader + registry
- [x] Zod-валидация схемы уровней
- [x] Система локаций, переходов, условий, эффектов
- [x] Sandbox-выполнение кода (QuickJS WASM)
- [x] Regex-валидация кода (legacy, на замену)

### Content
- [x] Демо-квест "Hello World" (4 локации, терминальные челленджи)
- [x] Reference level (5 челленджей)

### Infra
- [x] GitHub Pages deploy (Actions workflow)
- [x] Umami analytics

---

## Phase 0.5: Качество движка — 🔄 In Progress

Подготовка движка к масштабированию контента.

### Sandbox
- [x] Интеграционные тесты sandbox (26 тестов, Vitest)
- [x] Миграция regex → sandbox (все челленджи через QuickJS)
- [x] `__source` инжект для проверки исходного кода
- [x] `hints[]` — распознавание типичных ошибок с фидбеком

### Тесты
- [x] Vitest настроен
- [ ] Тесты level schema валидации
- [ ] Тесты effect/condition системы

---

## Phase 1: Пилотные квесты

Два обучающих квеста для вайбкодеров. Методология: "сначала опыт — потом термин".

### Квест А: "Зоопарк дронов" (полиморфизм)
- [ ] `level-polymorphism.ts` — 5 локаций
- [ ] Ветвление через флаги (if/else vs .execute())
- [ ] Мягкие последствия: штрафы HP/Focus, доп. локации
- [ ] Финальный экран с метриками и термином

### Квест Б: "Вирус на станции" (модульная архитектура)
- [ ] `level-modular-architecture.ts` — 5 локаций
- [ ] 3 пути: монолит / файлы без контракта / модули с интерфейсом
- [ ] Каскадные сбои и вирусная атака как последствия
- [ ] Финальный экран со сравнением подходов

### Связка
- [ ] Регистрация в levelRegistry
- [ ] `nextLevelId` между квестами

> Детальный дизайн квестов: [docs/PLAN.md](PLAN.md)

---

## Phase 2: Бэкенд + LLM

Серверная часть для валидации свободного ввода через GPT.

- [ ] Express.js + TypeScript
- [ ] Turborepo монорепо (общие типы front/back)
- [ ] `POST /api/validate-answer` — GPT-валидация
- [ ] Поле для кастомного ввода на фронте
- [ ] Loading states, error handling

---

## Phase 3: Визуал

- [ ] Картинки локаций (статика или DALL-E)
- [ ] Иконки предметов
- [ ] Портреты NPC / аватар игрока
- [ ] Кэширование сгенерированных изображений

---

## Phase 4: Расширенный мир

- [ ] Расширенные статы, инвентарь, экипировка
- [ ] Торговля с NPC
- [ ] Карта галактики, звёздные системы
- [ ] Фракции и репутация
- [ ] Больше квестов и NPC

---

## Phase 5: Сообщество

- [ ] Визуальный редактор квестов
- [ ] Загрузка и рейтинг пользовательских квестов
- [ ] Мультиплеер (опционально)

---

## Постоянные задачи

- [ ] E2E тесты критических путей
- [ ] CI/CD pipeline с тестами
- [ ] Accessibility (a11y)
- [ ] Performance оптимизация
- [ ] Error tracking (Sentry)
