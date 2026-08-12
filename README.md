# 🚗 Avtokond-Ugra: Система управления записями и техосмотром

## 📋 Описание проекта

**Avtokond-Ugra** - 

---

## 🚀 Быстрый старт

### За 5 минут до первого запуска:

```bash
# 1. Клонировать репозиторий
git clone https://github.com/GabuniyaHub/avtokond-ugra.ru.git

# 2. Установить зависимости
# Основные зависимости (из package.json)
npm install
#  TypeScript и типы (для разработки)
npm install --save-dev typescript @types/node tsx

# 3. Настроить .env файл (заполнить переменные окружения)
# отредактируйте файл .env
# NODE_ENV=production
# PORT=4080
# DATABASE_URL=file:/var/www/avtokond-ugra.ru/dist/database/database.sqlite

# 4. Скомпилировать TypeScript
npm run build

# 5. Создать папку для базы данных (если не создается автоматически)
mkdir -p dist/database
touch dist/database/database.sqlite

# 6. Создать структуру таблиц (если не создается автоматически)
# База создается при первом запуске сервера

# 7. Запустить сервер (для разработки)
npm run dev

# ИЛИ для продакшена через systemd
systemctl start avtokond-api
```

✅ Сервер запустится на **http://localhost:4080**


## 🛠 Стек технологий

| Слой | Технология | Описание |
|------|-----------|---------|
| **Фронтенд** | HTML, CSS, JavaScript | Основной сайт и формы |
| **Бэкенд** | Node.js | REST API для обработки запросов |
| **База данных** | sqlite | Хранение записей и сообщений |
| **ORM** | Prisma | Управление базой данных |

---

## 📊 Структура проекта

```
avtokond-ugra.ru/
├── src/                          # Исходный код TypeScript
│   ├── index.ts                  # Точка входа приложения
│   ├── config/                   # Конфигурации (БД, Email)
│   ├── controllers/              # Обработчики HTTP запросов
│   ├── services/                 # Бизнес-логика
│   ├── routes/                   # Определение маршрутов API
│   ├── middleware/               # Промежуточное ПО (auth, etc)
│   └── utils/                    # Вспомогательные функции
│
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Описание структуры БД
│
├── public/                       # Статические файлы
│   ├── index.html                # Главная страница
│   ├── js/forms.js              # Обработка форм
│   └── pages/                    # Другие страницы
│
│
├── package.json                  # Зависимости npm
├── tsconfig.json                 # Конфигурация TypeScript
├── docker-compose.yml            # Docker конфигурация
├── .env                          # Переменные окружения
└── Dockerfile                    # Образ для контейнера
```

```bash
*Пример .env
# База данных
DB_USER=
DB_PASSWORD=
# Секрет для генерации JWT токенов 
JWT_SECRET=
PORT=

# Настройки почты
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=
```
---


## 🔗 API Endpoints

### Публичные маршруты

```
POST   /api/appointment/request-code      Запрос кода подтверждения
POST   /api/appointment/verify             Подтверждение записи
POST   /api/appointment/resend-code        Повторная отправка кода
POST   /api/contact                        Отправка контактного сообщения
```

### Административные маршруты (требуют авторизации)

```
GET    /api/admin/appointments             Получить все записи
GET    /api/admin/appointments/:id         Получить запись по ID
PUT    /api/admin/appointments/:id/cancel  Отменить запись
GET    /api/admin/messages                 Получить все сообщения
DELETE /api/admin/messages/:id             Удалить сообщение
```

---

## 💾 База данных

### Модель Appointment (Запись на техосмотр)
- ID, ФИО, телефон, email
- Тип и модель ТС
- Дата и время записи
- Статус и код верификации
- История создания/обновления

### Модель ContactMessage (Контактное сообщение)
- ID, ФИО, email, телефон
- Тема и текст сообщения
- Статус (непрочитано, прочитано, отвечено)
- Дата создания


---

## 📞 Информация о компании

**ООО "Автоконд"**
- Адрес: ул. Сибирская, 121, пгт. Междуреченский
- Телефон: 8 (34677) 33463
- Email: avtokond2000@yandex.ru
- Сайт: https://avtokond-ugra.ru

---

## 📄 Лицензия

© 2025 ООО "Автоконд" - Все права защищены

---
