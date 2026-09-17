# Contributing to UPI Split

Thanks for taking a look! This is a small simulated payments app, so contributions are easy to review and land quickly.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Before opening a PR

```bash
npm run lint
npm test
npm run build
```

All three run in CI on every PR, so it's faster to catch issues locally first.

## Guidelines

- Keep PRs focused — one feature or fix per PR is easier to review than a bundle of unrelated changes.
- Match the existing style: Tailwind + shadcn/ui components, Zustand for state, Zod + React Hook Form for forms.
- Add or update tests in `lib/*.test.ts` for any logic change (especially `splitAmount.ts` — it's the core of the app).
- No real payment integrations, please — this project is intentionally 100% simulated with no backend.

## Good first issues

Look for issues labeled [`good first issue`](../../labels/good%20first%20issue) — they're scoped to be approachable without deep familiarity with the codebase.

## Reporting bugs / suggesting features

Please open an issue using the relevant template before starting work on anything non-trivial, so we can align on approach first.
