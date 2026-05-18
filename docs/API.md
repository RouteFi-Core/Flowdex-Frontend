# Flowdex API Reference

This document describes the Flowdex backend API endpoints consumed by the frontend. All requests are made to `NEXT_PUBLIC_FLOWDEX_API_URL` (default: `https://api.flowdex.io/v1`).

---

## Authentication

Most endpoints are public. Server-side requests may include an `Authorization` header using the `FLOWDEX_API_SECRET` environment variable. The frontend never exposes this secret.

---

## Response Envelope

All responses follow this shape:

```json
{
  "success": true,
  "data": { ... }
}
```

Errors:

```json
{
  "success": false,
  "message": "Human-readable error",
  "code": "MACHINE_READABLE_CODE",
  "details": { ... }
}
```

---

## Routing

### `POST /routing/quote`

Compute the optimal route for a swap.

**Request body:**

```json
{
  "inputAssetCode": "XLM",
  "inputAssetIssuer": null,
  "outputAssetCode": "USDC",
  "outputAssetIssuer": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
  "inputAmount": "100",
  "slippageTolerance": 0.5
}
```

| Field | Type | Description |
|---|---|---|
| `inputAssetCode` | `string` | Asset code (e.g. `"XLM"`, `"USDC"`) |
| `inputAssetIssuer` | `string \| null` | Issuer account ID. `null` for native XLM |
| `outputAssetCode` | `string` | |
| `outputAssetIssuer` | `string \| null` | |
| `inputAmount` | `string` | Amount as a decimal string |
| `slippageTolerance` | `number` | Percentage (e.g. `0.5` = 0.5%) |

**Response:** `RouteQuote`

```json
{
  "success": true,
  "data": {
    "inputAsset": { "code": "XLM", "issuer": null, "name": "Stellar Lumens", "decimals": 7 },
    "outputAsset": { "code": "USDC", "issuer": "GA5Z...", "name": "USD Coin", "decimals": 7 },
    "inputAmount": "100",
    "estimatedOutput": "12.3456789",
    "minimumOutput": "12.2839506",
    "paths": [
      {
        "id": "path-1",
        "splitPercent": 60,
        "estimatedOutput": "7.4074073",
        "priceImpact": 0.12,
        "hops": [
          { "asset": { "code": "XLM", ... }, "pool": "pool-abc", "fee": 30 },
          { "asset": { "code": "USDC", ... }, "pool": "pool-abc", "fee": 30 }
        ]
      },
      {
        "id": "path-2",
        "splitPercent": 40,
        "estimatedOutput": "4.9382716",
        "priceImpact": 0.08,
        "hops": [ ... ]
      }
    ],
    "fees": {
      "network": "0.00001",
      "protocol": "0.003",
      "total": "0.00301"
    },
    "slippageTolerance": 0.5,
    "expiresAt": 1716040758000,
    "simulationOnly": false
  }
}
```

---

### `POST /routing/simulate`

Same as `/routing/quote` but marks the response `simulationOnly: true` and does not reserve liquidity. Used by the developer console.

---

## Swap

### `POST /swap/execute`

Submit a signed transaction for broadcast.

**Request body:**

```json
{
  "quoteId": "quote-abc123",
  "signedXdr": "AAAAAgAAAA...",
  "walletAddress": "GABC..."
}
```

**Response:** `Transaction`

```json
{
  "success": true,
  "data": {
    "id": "tx-xyz",
    "hash": null,
    "status": "pending",
    "inputAsset": { ... },
    "outputAsset": { ... },
    "inputAmount": "100",
    "outputAmount": null,
    "route": [ ... ],
    "createdAt": 1716040758000
  }
}
```

---

### `GET /swap/transactions/:id`

Poll for transaction status.

**Response:** `Transaction` (same shape as above, with `hash`, `outputAmount`, and `confirmedAt` populated on success)

---

### `GET /swap/transactions?wallet=<address>`

Fetch transaction history for a wallet address.

**Response:** `Transaction[]`

---

## Liquidity

### `GET /liquidity/pools`

List all available liquidity pools.

**Response:** `LiquidityPool[]`

```json
{
  "success": true,
  "data": [
    {
      "id": "pool-xlm-usdc",
      "assetA": { "code": "XLM", "issuer": null, ... },
      "assetB": { "code": "USDC", "issuer": "GA5Z...", ... },
      "reserveA": "1000000",
      "reserveB": "123456",
      "totalShares": "350000",
      "fee": 30,
      "apr": 8.4,
      "volume24h": "450000",
      "tvl": "2460000"
    }
  ]
}
```

---

### `GET /liquidity/pools/:id`

Get a single pool by ID.

---

### `GET /liquidity/pools/:id/history?interval=1d`

Get price history for a pool.

**Query params:**

| Param | Values | Default |
|---|---|---|
| `interval` | `1h`, `1d`, `1w` | `1d` |

**Response:** `PricePoint[]`

```json
{
  "success": true,
  "data": [
    { "timestamp": 1716000000000, "price": 0.1234, "volume": 45000 },
    { "timestamp": 1716086400000, "price": 0.1251, "volume": 52000 }
  ]
}
```
