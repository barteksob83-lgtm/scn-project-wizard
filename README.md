# SCN Project Wizard

Aplikacja webowa typu multi-step form dla marki premium SCN Group pod CTA **„Rozpocznij projekt”**.

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (animacje przejść)

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:3000`.

## Funkcje

- 6-krokowy wizard zgodny z procesem usług SCN Group
- progress bar z numerem kroku
- animacje przejścia między krokami
- mobile-first, responsywny layout
- walidacja formularza kontaktowego
- zebranie odpowiedzi do pojedynczego JSON i wysyłka `POST /api/submit`
- gotowe miejsce pod webhook / CRM / email API
- ekran sukcesu po wysłaniu
