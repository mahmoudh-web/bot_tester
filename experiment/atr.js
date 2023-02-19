/* 
    Find list of pairs where atr is 1% of price in last day on hourly chart
*/
import * as dotenv from "dotenv"
dotenv.config()
import * as indicators from "../lib/indicators/indicators.js"
import { getCandles } from "../lib/historical/getCandles.js"
import { getInstruments } from "../lib/historical/getInstruments.js"
import { addIndicatorData } from "../lib/historical/addIndicatorData.js"

// get list of instruments
const instruments = await getInstruments()

const stats = []

for await (let instrument of instruments) {
	const candles = await getCandles(instrument.symbol, 3)
	const atr = indicators.atr(candles, 5)

	const completeData = addIndicatorData(candles, { name: "atr", data: atr })

	let trade = 0
	let noTrade = 0

	completeData.forEach(candle => {
		const one = (candle.close * 0.02) / 10
		if (candle.atr >= one) {
			trade += 1
		} else {
			noTrade += 1
		}
	})
	const tradeable = (trade / completeData.length) * 100
	stats.push({
		symbol: instrument.symbol,
		"tradeable candles": trade,
		"untradeable candles": noTrade,
		percentage: tradeable,
	})
}
stats.forEach(stat => console.log(stat))
