# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| `main` branch | ✅ |
| Older releases | ❌ |

We only provide security fixes for the latest code on `main`.

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email the maintainers at **security@flowdex.io** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

We will acknowledge your report within 48 hours and aim to release a fix within 7 days for critical issues.

---

## Security Principles

### Private keys never touch the frontend

Flowdex never asks for, stores, or transmits private keys. All transaction signing happens inside the user's wallet extension (Freighter, xBull, etc.) via the Stellar Wallets Kit API.

### No secrets in `NEXT_PUBLIC_` variables

Variables prefixed with `NEXT_PUBLIC_` are inlined into the JavaScript bundle and visible to anyone. The `FLOWDEX_API_SECRET` is server-side only and never exposed to the browser.

### Content Security Policy

The `next.config.ts` sets security headers on all responses:

- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`

### Dependency hygiene

- Dependencies are pinned to exact versions in `package.json`.
- Run `npm audit` regularly and address high/critical advisories promptly.
- Dependabot is configured to open PRs for security updates.

### Input validation

All user inputs (amounts, asset codes) are validated before being sent to the API. The API is the authoritative validator — the frontend validation is a UX convenience only.
