/* 
    gets the average true range for hourly candles to see if there is enough
    movement in price as to be profitable. Fees are 0.2%, therefore need more movement than this per hour
*/

import * as dotenv from "dotenv"
import { DateTime } from "luxon"
import mongoose from "mongoose"
import { connectDb } from "./mongo/connection.js"
import * as indicators from "./lib/indicators/indicators.js"
dotenv.config()

import { Instrument, kline_1h } from "./mongo/schema.js"
import { addIndicatorData } from "./lib/historical/addIndicatorData.js"
import { reverse, sortBy } from "lodash-es"

await connectDb()
// get all instruments
const instruments = await Instrument.find({
	quoteAsset: "USDT",
	download: true,
	isSpotTradingAllowed: true,
})

console.log(`imported ${instruments.length} pairs`)
const results = []
let x = 1
for await (let instrument of instruments) {
	// get candles for last 30 days

	console.log(
		`processing ${instrument.symbol}, ${x} of ${instruments.length}`
	)
	x++
	const candles = await kline_1h.find({
		identifier: { $regex: `^${instrument.symbol}` },
		// start: { $lte: start.ts },
	})
	if (!candles.length) continue

	const start = DateTime.fromMillis(candles.at(-1).startTime)
		.minus({ days: 2 })
		.startOf("day")

	const data = []
	candles.forEach(candle => {
		if (candle.startTime >= start.ts) {
			const format = {
				startTime: candle.startTime,
				closeTime: candle.closeTime,
				startTimeISO: candle.startTimeISO,
				closeTimeISO: candle.closeTimeISO,
				open: candle.open,
				high: candle.high,
				low: candle.low,
				close: candle.close,
				volume: candle.volume,
				symbol: candle.symbol,
			}

			data.push(format)
		}
	})

	const atr = indicators.atr(data, 24)
	const atrSma = indicators.indicatorSma(atr, 24)

	const combined = addIndicatorData(
		data,
		{ name: "atr", data: atr },
		{ name: "atrSma", data: atrSma }
	)

	const price = data.at(-1).open

	const movement = (combined.at(-1).atr / combined.at(-1).open) * 100
	results.push({
		symbol: combined.at(-1).symbol,
		price: combined.at(-1).open,
		atr: combined.at(-1).atr,
		atrSma: combined.at(-1).atrSma,
		percentage: movement.toFixed(2),
	})
}

// disconnect from db
mongoose.disconnect()

const topTen = reverse(sortBy(results, o => o.percentage))

for (let i = 0; i < topTen.length; i++) {
	console.log(topTen[i])
}
