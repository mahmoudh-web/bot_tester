import * as indicators from "../lib/indicators/indicators.js"
import { getCandles } from "../lib/historical/getCandles.js"
import { addIndicatorData } from "../lib/historical/addIndicatorData.js"
import { DateTime } from "luxon"
import { buyAmount, sellAmount } from "../lib/trade.js"

// BUY: psar below low, open below bollinger channel
// SELL: psar above high, open above bollinger channel
const runSarBollinger = async (symbol, interval, settings) => {
	// get candles
	const candlesAll = await getCandles(symbol, interval)
	if (!candlesAll.length) return

	// filter for 2022
	const yearStart = DateTime.fromISO("2022-01-01T00:00:00.000").setZone("utc")

	const candles = candlesAll.filter(candle => candle.start >= yearStart)

	// apply indicators
	// const macd = indicators.macd(candles, settings.macd)
	const PSAR = indicators.psar(candles, settings.psar)
	const bollinger = indicators.bollinger(candles, settings.bollinger)

	const data = addIndicatorData(
		candles,
		// { name: "macd_line", data: macd.macdLine },
		// { name: "macd_signal", data: macd.macdSignal },
		// { name: "macd_histogram", data: macd.histogram },
		{ name: "psar", data: PSAR },
		{ name: "bollinger_lower", data: bollinger.lower },
		{ name: "bollinger_middle", data: bollinger.middle },
		{ name: "bollinger_upper", data: bollinger.upper }
	)

	// test candles
	let openTrade = false

	let usdt = 100
	let token = 0

	let buys = 0
	let sells = 0
	let losing = 0

	data.forEach(candle => {
		if (openTrade) {
			const sellSignal = sell(candle)
			if (sellSignal) {
				console.log(
					`SELL: ${candle.startISO}, Price: ${
						candle.open
					}, Profit: ${sellAmount(candle.open, token).toFixed(2)}`
				)
				usdt += sellAmount(candle.open, token)
				if (sellAmount(candle.open, token) <= 10) losing++
				token = 0
				sells++
				printBalance(usdt, token)
				openTrade = false
			}
		} else {
			const buySignal = buy(candle)
			if (buySignal) {
				console.log(`BUY: ${candle.startISO}, Price: ${candle.open}`)
				usdt -= 10
				token += buyAmount(candle.open, 10)
				buys++
				printBalance(usdt, token)
				openTrade = true
			}
		}
	})
	console.log(`Buys: ${buys}, Sells: ${sells}, Losing: ${losing}`)
	const winRate = Number((((buys - losing) / buys) * 100).toFixed(2))
	const loseRate = Number(((losing / buys) * 100).toFixed(2))
	const profit = Number((((usdt - 100) / usdt) * 100).toFixed(2))
	return { buys, sells, losing, usdt, token, winRate, loseRate, profit }
}

function buy(candle) {
	if (candle.open < candle.bollinger_lower && candle.psar < candle.low)
		return true
	return false
}

function sell(candle) {
	if (candle.open > candle.bollinger_lower && candle.psar > candle.low)
		return true
	return false
}

function printBalance(usdt, token) {
	console.log(`USDT Balance: ${usdt.toFixed(2)}, Token Balance: ${token}`)
}

export { runSarBollinger }
