# Contributing to Flowdex

Thank you for your interest in contributing! Flowdex is an open-source project and we welcome contributions of all kinds — bug fixes, new features, documentation improvements, performance work, and more.

Please take a few minutes to read this guide before opening an issue or pull request. It will save everyone time.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Strategy](#branch-strategy)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating you agree to uphold it. Report unacceptable behaviour to the maintainers.

---

## How to Contribute

There are many ways to contribute without writing a single line of code:

- **Report bugs** — open a GitHub issue with a clear reproduction
- **Improve docs** — fix typos, clarify explanations, add examples
- **Review PRs** — leave constructive feedback on open pull requests
- **Answer questions** — help others in GitHub Discussions

If you want to contribute code, look for issues labelled `good first issue` or `help wanted`.

---

## Development Setup

### Prerequisites

- Node.js ≥ 18.17
- npm ≥ 9

### Steps

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/flowdex-frontend.git
cd flowdex-frontend

# 2. Install dependencies
npm install

# 3. Copy environment config
cp .env.example .env.local
# Edit .env.local — at minimum set NEXT_PUBLIC_FLOWDEX_API_URL

# 4. Start the dev server
npm run dev
```

The app will be available at http://localhost:3000.

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready code |
| `dev` | Integration branch for upcoming releases |
| `feat/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation-only changes |
| `chore/<name>` | Tooling, deps, config |

Always branch off `dev`, not `main`.

```bash
git checkout dev
git pull origin dev
git checkout -b feat/my-feature
```

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Examples:**

```
feat(swap): add route comparison toggle
fix(wallet): handle Freighter rejection gracefully
docs(readme): update environment variable table
chore(deps): bump stellar-sdk to 12.2.0
```

Keep the summary under 72 characters. Use the body to explain *why*, not *what*.

---

## Pull Request Process

1. **Open an issue first** for non-trivial changes so we can discuss the approach before you invest time coding.
2. Keep PRs focused — one feature or fix per PR.
3. Fill in the PR template completely.
4. Ensure all checks pass: `npm run lint`, `npm run type-check`, `npm run format:check`.
5. Add or update tests for any changed behaviour.
6. Request a review from at least one maintainer.
7. Squash commits before merging (the maintainer will do this if you forget).

### PR Title Format

Follow the same Conventional Commits format as commit messages:

```
feat(liquidity): add pool search and filter
```

---

## Code Style

- **TypeScript** — strict mode is enabled. No `any` unless absolutely unavoidable (add a comment explaining why).
- **Formatting** — Prettier handles this. Run `npm run format` before committing.
- **Linting** — ESLint with the Next.js config. Run `npm run lint` to check.
- **Imports** — use the `@/` path alias for all internal imports. No relative `../../` chains.
- **Components** — one component per file. File name matches the export name.
- **State** — use Zustand stores for global state. Keep component-local state in `useState`.
- **Data fetching** — all server data goes through React Query hooks in `src/features/*/hooks.ts`. No raw `fetch` or `axios` calls in components.
- **Env access** — always use `src/lib/env.ts`. Never read `process.env` directly in feature code.

---

## Testing

> The test suite is being set up. Watch this space.

When tests are available, run them with:

```bash
npm test
```

For now, manually verify:

1. The swap form fetches a quote when both assets and an amount are set.
2. The route graph renders correctly for multi-path quotes.
3. The wallet connects and disconnects without errors.
4. The dev console runs a simulation and displays the raw JSON response.
5. Dark mode toggles correctly.

---

## Reporting Bugs

Open a [GitHub issue](https://github.com/flowdex/flowdex-frontend/issues/new?template=bug_report.md) and include:

- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behaviour
- Browser and OS
- Relevant console errors or screenshots

---

## Requesting Features

Open a [GitHub issue](https://github.com/flowdex/flowdex-frontend/issues/new?template=feature_request.md) and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

We'll discuss feasibility and priority before any implementation begins.

---

## Questions?

Open a [GitHub Discussion](https://github.com/flowdex/flowdex-frontend/discussions) — we're happy to help.
