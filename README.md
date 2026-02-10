# followace.com

Личный сайт Ace — burnout quiz + link in bio.

## Структура

```
followace.com/           → редирект на /links
followace.com/links      → страница ссылок (link in bio)
followace.com/burnouttest → квиз Burnout Score
```

## Деплой на Vercel (5 минут)

### 1. Залить на GitHub

```bash
cd followace
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/followace.git
git branch -M main
git push -u origin main
```

### 2. Подключить к Vercel

1. Зайди на [vercel.com](https://vercel.com) → войди через GitHub
2. "Add New Project" → выбери `followace`
3. Vercel определит Next.js автоматически → жми **Deploy**
4. Готово — сайт на `followace.vercel.app`

### 3. Подключить домен followace.com

1. В Vercel → Settings → Domains → добавь `followace.com`
2. Vercel покажет DNS записи
3. Зайди в Namecheap → Domain List → followace.com → Advanced DNS
4. Добавь записи которые показал Vercel (обычно A record и CNAME)
5. Подожди 5-30 минут
6. SSL подключится автоматически

## Что заменить перед деплоем

Открой `app/links/page.js` и замени:
- `YOUR_CHANNEL` → твой YouTube канал
- `YOUR_HANDLE` → твой TikTok/Instagram handle
- `YOUR_EMAIL` → твой email

Открой `app/burnouttest/BurnoutQuiz.js` и замени:
- `YOUR_HANDLE` → твой Instagram handle

## Локальная разработка

```bash
npm install
npm run dev
```

Откроется на `http://localhost:3000`

## Добавление аватара

1. Положи фото в `public/avatar.jpg`
2. В `app/links/page.js` замени блок аватара на:
```jsx
<img
  src="/avatar.jpg"
  alt="Ace"
  style={{
    width: "88px", height: "88px",
    borderRadius: "50%", objectFit: "cover",
    border: "2px solid #1E1E22",
    margin: "0 auto 20px", display: "block",
  }}
/>
```
