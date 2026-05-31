# Sports Events API

Повноцінний REST API для керування спортивними подіями з аутентифікацією через JWT-cookie.

## Технології

Node.js, Express 5, MongoDB (Mongoose), JWT, bcryptjs, Joi, cookie-parser, CORS

## Встановлення та запуск

```bash
cd project/server
npm install
```

Створіть файл `.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5500
```

```bash
npm run dev   # з nodemon
npm start     # без nodemon
```

Статичні HTML-файли з папки `public/` роздаються автоматично.

## Ендпоїнти

|Метод|URL|Захист|Опис|
|---|---|---|---|
|POST|`/api/auth/register`|–|Реєстрація нового користувача|
|POST|`/api/auth/login`|–|Вхід, встановлення cookie|
|POST|`/api/auth/logout`|protect|Вихід, очищення cookie|
|GET|`/api/auth/me`|protect|Профіль поточного користувача|
|GET|`/api/events`|–|Список всіх подій|
|GET|`/api/events/:id`|–|Одна подія|
|POST|`/api/events`|protect|Створити подію|
|PUT|`/api/events/:id`|protect|Оновити подію (власник або admin)|
|DELETE|`/api/events/:id`|admin|Видалити подію|
|GET|`/api/events/:eventId/registrations`|–|Всі реєстрації на подію|
|POST|`/api/events/:eventId/registrations`|protect|Зареєструватися на подію|
|DELETE|`/api/events/:eventId/registrations/:id`|protect|Скасувати реєстрацію (автор або admin)|

## Структура проєкту

```
project/
├── public/               # Статичний фронтенд
│   ├── index.html        # Список подій
│   ├── login.html        # Вхід
│   ├── register.html     # Реєстрація
│   ├── create.html       # Створення події
│   └── registration.html # Реєстрація на подію
└── server/
    ├── controllers/      # Обробники запитів
    ├── services/         # Бізнес-логіка
    ├── models/           # Mongoose-схеми (User, Event, Registration)
    ├── routes/           # Маршрути
    ├── middleware/        # protect, restrictTo, validate
    ├── validators/        # Joi-схеми валідації
    ├── utils/            # AppError, catchAsync
    └── app.js            # Точка входу
```

## Ролі користувачів

- **user** — може створювати події та керувати власними реєстраціями
- **admin** — може видаляти будь-які події та реєстрації
