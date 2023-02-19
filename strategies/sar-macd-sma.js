import { getCandles } from "../lib/historical/getCandles.js"
import * as indicators from "../lib/indicators/indicators.js"
import { addIndicatorData } from "../lib/historical/addIndicatorData.js"
import { DateTime } from "luxon"

const sarMacdSma = async (symbol, interval, settings) => {
	// get candles
	const candlesAll = await getCandles(symbol, interval)
	if (!candlesAll.length) return

	// filter for 2022
	const yearStart = DateTime.fromISO("2022-01-01T00:00:00.000").setZone("utc")

	const candles = candlesAll.filter(candle => candle.start >= yearStart)
	console.log(candlesAll[0])

	// apply indicators
	const sma = indicators.sma(candles, settings.sma)
	const macd = indicators.macd(candles, settings.macd)
	const PSAR = indicators.psar(candles, settings.psar)

	const data = addIndicatorData(
		candles,
		{ name: "sma", data: sma },
		{ name: "macd_line", data: macd.macdLine },
		{ name: "macd_signal", data: macd.macdSignal },
		{ name: "macd_histogram", data: macd.histogram },
		{ name: "psar", data: PSAR }
	)

	let base = 0
	let quote = 100
	let min = 100
	let losing = 0

	const amount = 10
	let buys = 0
	let sells = 0

	let trade = { buy: 0, sell: 0, profit: 0, target: 0, stopLoss: 0 }

	data.forEach(candle => {
		// no open trade
		if (trade.buy === 0) {
			const buySignal = buy(candle)
			if (buySignal && quote > amount) {
				trade.buy = candle.open
				quote -= amount
				base += (1 / candle.open) * (amount * 0.999)
				buys++
				trade.target = candle.open * 1.003
				trade.stopLoss = candle.open - candle.open * 0.01
				console.log(
					`${candle.startISO}: Buy trade executed, ${JSON.stringify(
						trade,
						null,
						2
					)}`
				)
			}
		} else {
			const sellSignal = sell(candle, trade.target, trade.stopLoss)
			if (sellSignal) {
				trade.sell = candle.open
				trade.profit = (base * candle.open * 0.999 - amount).toFixed(2)
				quote += base * candle.open * 0.999
				base = 0
				sells++
				if (candle.open >= trade.target) {
					console.log(
						`${
							candle.startISO
						}: Sell trade executed, ${JSON.stringify(
							trade,
							null,
							2
						)}`
					)
				} else if (candle.open <= trade.stopLoss) {
					losing++
					console.log(`${candle.startISO}: Stop Loss Hit`)
				}
				trade.buy = 0
				trade.sell = 0
				trade.target = 0
				trade.profit = 0
				trade.stopLoss = 0
			}
		}
	})

	console.log(`Buys: ${buys}, Sells: ${sells}`)
	console.log(`Account Balance: ${quote.toFixed(2)}`)
	console.log(`Token Balance: ${base.toFixed(8)}`)
	console.log(`Losing Trades: ${losing}`)
	// console.log(`Min balance (max drawdown): ${min.toFixed(2)}`)
}

function sell(candle, target, stopLoss) {
	if (
		(target > candle.low && target < candle.high) ||
		candle.low <= stopLoss
		// candle.psar > candle.high ||
		// (trade.target > candle.low && trade.target < candle.high)
	)
		return true
	return false
}

function buy(candle) {
	if (candle.psar < candle.low /*&& candle.macd_histogram > 0*/) return true
	return false
}

export { sarMacdSma }
