# Space Rangers Quest

## Quick Links
- [Project Overview](docs/PROJECT.md) — что это и зачем
- [Tech Stack](docs/TECH_STACK.md) — технологии и архитектура
- [Game Design](docs/GAME_DESIGN.md) — игровые механики и UI
- [Roadmap](docs/ROADMAP.md) — фазы разработки

---

## Decisions Log

Решения, принятые в ходе обсуждения проекта:

| Область | Решение | Причина |
|---------|---------|---------|
| **Frontend** | React + TypeScript | Большая экосистема, строгая типизация |
| **Styling** | Tailwind CSS | Быстрая разработка, utility-first |
| **Build** | Vite | Быстрый HMR, современный DX |
| **State** | Zustand | Лёгкий, persist middleware для сохранений |
| **Backend** | Express.js | Простой, проверенный, для прокси OpenAI |
| **Data** | JSON файлы | Без БД на старте, версионирование в git |
| **Save** | LocalStorage | Работает офлайн, просто |
| **Monorepo** | Turborepo | Общие типы между front и back (Phase 1+) |
| **LLM** | OpenAI API | Валидация кастомных ответов |
| **Images** | Позже: DALL-E / upload | Phase 3 |

---

## Current Phase: 0 (MVP)

### Scope
- Только фронтенд, без бэкенда
- Один демо-квест "Ship Repair"
- Минимальный UI
- Работает полностью в браузере

### Demo Quest Story
Космический корабль "Синтаксис-7" управляется бортовым AI на JavaScript. Из-за бага система питания отключилась. Игрок просыпается в каюте и должен добраться до машинного отделения, чтобы написать фикс в терминале.

### Locations
1. **Каюта** (cabin) — spawn point
2. **Коридор** (corridor) — переход
3. **Машинное отделение** (engine_room) — терминал для JS-фикса

### Terminal Challenge
```javascript
// Система питания отключена. Напишите функцию:
powerSystem.activate = function() {
  return true;
}
```

---

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Tailwind для стилей
- Zustand для глобального состояния
- JSON для данных квестов

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```
