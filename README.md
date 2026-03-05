# Lighthouse Club (Frontend)

`lighthouse-club` is the frontend for BlackIn, a Base-first AI code editor that connects to `lighthouse-main` for prompt generation, workspace updates, socket terminal streaming, and deployment status.

## Product Scope

The active runtime path is Base-only. The UI sends generation requests with `chain=BASE`, exposes Base deployment commands, and routes terminal events through the socket service.

## Local Development

### 1) Required services

Run backend and socket from `lighthouse-main` first:

- API: `http://localhost:8787`
- Socket: `ws://localhost:8282`

### 2) Frontend env

Create or update `.env.local` with at least:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8787
NEXT_PUBLIC_SOCKET_URL=ws://localhost:8282
NEXT_PUBLIC_DEV_ACCESS_MODE=true
NEXT_PUBLIC_SKIP_AUTH=true
NEXT_PUBLIC_CHAIN_BASE_ENABLED=true
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_BASE_MAINNET_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_DISABLE_PRIVY=true
```

Optional provider keys for full wallet and payments behavior:

- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- `NEXT_PUBLIC_PRIVY_APP_ID` (if Privy enabled)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### 3) Install and run

```bash
pnpm install
pnpm --filter web dev
```

App URL:

- `http://localhost:3000`

## Quality Checks

```bash
pnpm --filter web lint
pnpm --filter web build
```

## Deployment Command Surface

The terminal command panel supports:

- `winter build`
- `winter test`
- `winter deploy --base-sepolia`
- `winter deploy --base-mainnet`

Legacy Solana deploy commands are intentionally disabled in active behavior.

## Repo Layout

- `apps/web`: Next.js frontend
- `packages/*`: shared types/config packages

## Notes

- If Privy credentials are unavailable, keep `NEXT_PUBLIC_DISABLE_PRIVY=true` for local runs.
- For end-to-end generation/deploy flows, `lighthouse-main` must be running with DB/Redis reachable.
