/* 
    Buy Entry: 
        macd line and signal negative
        macd line value higher than previous candle
        macd histogram higher than previous candle

*/

import { addIndicatorData } from "../lib/historical/addIndicatorData.js"
import { getCandles } from "../lib/historical/getCandles.js"
import * as indicators from "../lib/indicators/indicators.js"
import { isEmpty } from "lodash-es"
import { stats } from "../lib/stats.js"

const buySignal = (candle, prevCandle) => {
	if (
		candle["macd line"] > 0 ||
		candle["macd signal"] > 0 ||
		candle["macd histogram"] > 0
	)
		return false

	if (
		candle["macd line"] > prevCandle["macd line"] &&
		candle["macd histogram"] > prevCandle["macd histogram"]
	)
		return true

	return false
}

const sellSignal = (candle, prevCandle) => {
	if (
		candle["macd line"] < 0 ||
		candle["macd signal"] < 0 ||
		candle["macd histogram"] < 0
	)
		return false

	if (
		candle["macd line"] < prevCandle["macd line"] &&
		candle["macd histogram"] < prevCandle["macd histogram"]
	)
		return true

	return false
}

const exitTrade = (trade, candle) => {
	// simple 2:1 return
	if (trade.target < candle.high && trade.target > candle.low) return true
	// if (trade.stopLoss < candle.high && trade.stopLoss > candle.low) return true
	return false
}

const stopTrade = (trade, candle) => {
	// if (trade.target < candle.high && trade.target > candle.low) return true
	if (trade.stopLoss < candle.high && trade.stopLoss > candle.low) return true
	return false
}

const macd = async (symbol, interval, settings) => {
	// get candles
	const candles = await getCandles(symbol, interval)

	// use indicator(s)
	const macdOutput = indicators.macd(candles, settings)
	const atrOutput = indicators.atr(candles, settings.atr)

	const data = addIndicatorData(
		candles,
		{ name: "macd line", data: macdOutput.macdLine },
		{ name: "macd signal", data: macdOutput.macdSignal },
		{ name: "macd histogram", data: macdOutput.histogram },
		{ name: "atr", data: atrOutput }
	)

	// store data
	let liveTrade = {}

	// create list of possible candles to ttrade on
	const opportunities = []
	const closedTrades = []

	// cycle through candles looking for a trade (start from 5th candle so can average atr and histogram data)
	for (let i = 5; i < data.length; i++) {
		console.log(`candle ${i + 1} of ${data.length}`)
		if (isEmpty(liveTrade)) {
			// 1% must be achievable in x candles
			const targetAmount = (data[i].close * 0.01) / 5
			if (data[i].atr >= targetAmount) {
				// check for buy signal
				const buy = buySignal(data[i], data[i - 1])
				const sell = sellSignal(data[i], data[i - 1])

				const target = buy
					? data[i].close + data[i].close * 0.01
					: data[i].close - data[i].close * 0.01
				const stopLoss = buy
					? data[i].close - data[i].close * 0.01
					: data[i].close + data[i].close * 0.01

				if (buy || sell) {
					liveTrade = {
						time: data[i].startISO,
						openPrice: data[i].close,
						target,
						stopLoss,
						closed: false,
						direction: buy ? "buy" : "sell",
					}
				}
			}
		} else {
			// console.log(
			// 	`current trade: ${liveTrade.direction}, ${liveTrade.time}`
			// )
			const checkExit = exitTrade(liveTrade, data[i])
			if (checkExit) {
				closedTrades.push({
					...liveTrade,
					closed: true,
					closeTime: data[i].startISO,
					closePrice: liveTrade.target,
					profit:
						liveTrade.direction === "buy"
							? liveTrade.target - liveTrade.openPrice
							: liveTrade.openPrice - liveTrade.target,
				})
				liveTrade = {}
			}
			//  else {
			// 	const checkStopLoss = stopTrade(liveTrade, data[i])
			// 	if (checkStopLoss) {
			// 		closedTrades.push({
			// 			...liveTrade,
			// 			closed: true,
			// 			closeTime: data[i].startISO,
			// 			closePrice: liveTrade.stopLoss,
			// 			profit:
			// 				liveTrade.direction === "buy"
			// 					? liveTrade.stopLoss - liveTrade.openPrice
			// 					: liveTrade.openPrice - liveTrade.stopLoss,
			// 		})
			// 		liveTrade = {}
			// 	}
			// }
		}
	}

	// closedTrades.forEach(trade => console.log(trade))
	console.log(data[data.length - 1])
	stats(closedTrades)
}

export { macd }
