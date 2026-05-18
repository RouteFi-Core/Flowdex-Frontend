# Deployment

Flowdex is a standard Next.js application and can be deployed anywhere Next.js runs.

---

## Vercel (recommended)

Vercel is the easiest deployment target for Next.js.

### Steps

1. Push your fork to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repository.
3. Set the following environment variables in the Vercel dashboard:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_STELLAR_NETWORK` | `MAINNET` |
   | `NEXT_PUBLIC_HORIZON_URL` | `https://horizon.stellar.org` |
   | `NEXT_PUBLIC_SOROBAN_RPC_URL` | `https://soroban-rpc.stellar.org` |
   | `NEXT_PUBLIC_FLOWDEX_API_URL` | Your production API URL |
   | `FLOWDEX_API_SECRET` | Your server-side API secret |
   | `NEXT_PUBLIC_ENABLE_DEV_MODE` | `false` |
   | `NEXT_PUBLIC_ENABLE_ROUTE_SIMULATION` | `false` |

4. Click **Deploy**.

Vercel will automatically redeploy on every push to `main`.

---

## Docker / Self-hosted

### Build the image

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Enable standalone output in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // ...
};
```

### Run

```bash
docker build -t flowdex-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_STELLAR_NETWORK=MAINNET \
  -e NEXT_PUBLIC_FLOWDEX_API_URL=https://api.flowdex.io/v1 \
  flowdex-frontend
```

---

## Environment Variables at Build Time

Variables prefixed with `NEXT_PUBLIC_` are **inlined at build time**. This means:

- You must set them before running `npm run build`.
- Changing them after the build requires a rebuild.
- They are visible in the browser's JavaScript bundle — never put secrets in `NEXT_PUBLIC_` variables.

The `FLOWDEX_API_SECRET` variable (no `NEXT_PUBLIC_` prefix) is only available server-side and is never exposed to the browser.

---

## Health Check

Once deployed, verify the app is working:

1. Open the app — it should redirect to `/swap`.
2. The swap form should load without errors.
3. The liquidity page should load (even if the API returns empty data).
4. Dark mode toggle should work.

---

## Custom Domain

On Vercel: **Project Settings → Domains → Add**.

For self-hosted deployments, configure your reverse proxy (nginx, Caddy, etc.) to forward traffic to port 3000.
