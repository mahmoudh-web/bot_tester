import * as dotenv from "dotenv"
import { sarBollinger } from "./strategies/sar-bollinger.js"
dotenv.config()

import { sarMacdSma } from "./strategies/sar-macd-sma.js"

// macd("BTCUSDT", 1, { short: 12, long: 26, signal: 9, atr: 5 })
// await sarMacdSma("NEOUSDT", 1, {
// 	psar: { increment: 0.2, max: 0.4 },
// 	macd: { short: 10, long: 15, signal: 9 },
// 	sma: 100,
// })

// psar combined with bollinger (tight) for confirmation
await sarBollinger("BTCUSDT", 3, {
	psar: { increment: 0.2, max: 0.4 },
	// macd: { short: 5, long: 8, signal: 9 },
	bollinger: { period: 3, deviation: 0.5 },
})
