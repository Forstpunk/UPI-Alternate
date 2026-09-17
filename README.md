# UPI Split

A simulated UPI payments app built with Next.js. It mimics a GPay/PhonePe-style mobile experience — send money, receive via QR, and browse transaction history — with one twist: any payment over a configurable limit (default ₹1,999) is automatically split into multiple sequential transactions, mirroring per-transaction limits enforced by real UPI apps.

**No real payments are ever made.** Everything is simulated and stored locally in the browser.

🔗 **Live demo:** https://upi-split-black.vercel.app

## Features

- **Home** — balance overview with show/hide toggle, quick actions, recent transactions
- **Send** — a 3-step flow (recipient → amount → review & pay) with real-time UPI ID validation and a live preview of how a large payment will be split
- **Split payment engine** — deterministic, paise-accurate splitting logic with an animated per-chunk processing UI (pending → processing → done)
- **Receive** — generates a scannable UPI deep-link QR code, with an optional amount request that updates the QR live
- **History** — transactions grouped by date, expandable to show the exact chunk breakdown for split payments
- **Persistent local state** — balance, contacts, and transaction history persist across reloads via `localStorage`

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (New York style)
- [Zustand](https://github.com/pmndrs/zustand) for state management, with `persist` middleware
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for form validation
- [Framer Motion](https://www.framer.com/motion/) for the payment processing / success animations
- [qrcode.react](https://github.com/zpao/qrcode.react) for QR code generation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
app/                  Routes (home, send, receive, history)
components/           Shared UI components
components/ui/        shadcn/ui primitives
lib/                  Store, types, formatting, and the split-payment engine
```

## Building for production

```bash
npm run build
npm run start
```

## License

MIT
