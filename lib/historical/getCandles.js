import mongoose from "mongoose"
import { connectDb, disconnectDb } from "../../mongo/connection.js"
import {
	kline_1m,
	kline_3m,
	kline_5m,
	kline_15m,
	kline_1h,
} from "../../mongo/schema.js"

const getCandles = async function (symbol, interval) {
	console.log(`Getting candles from Db for ${symbol}, ${interval}m`)
	await connectDb()

	let data
	const res = []
	switch (interval) {
		case 1:
			console.log("getting 1m data")
			data = await kline_1m
				.find({ symbol: { $regex: new RegExp(`^${symbol}`) } })
				.sort({ identifier: 1 })
			break
		case 3:
			console.log("getting 3m data")
			data = await kline_3m
				.find({ identifier: { $regex: new RegExp(`^${symbol}`) } })
				.sort({ identifier: 1 })
			break
		case 5:
			console.log("getting 5m data")
			data = await kline_5m
				.find({ identifier: { $regex: new RegExp(`^${symbol}`) } })
				.sort({ identifier: 1 })
			break
		case 15:
			console.log("getting 15m data")
			data = await kline_15m
				.find({ identifier: { $regex: new RegExp(`^${symbol}`) } })
				.sort({ identifier: 1 })
			break
		case 60:
			console.log("getting 60m data")
			data = await kline_1h
				.find({ identifier: { $regex: new RegExp(`^${symbol}`) } })
				.sort({ identifier: 1 })
			break
	}

	data.forEach(candle => {
		const format = {
			start: candle.startTime,
			open: candle.open,
			high: candle.high,
			low: candle.low,
			close: candle.close,
			volume: candle.volume,
			startISO: candle.startTimeISO,
			symbol: candle.symbol,
		}
		res.push(format)
	})

	// mongoose.disconnect()
	// disconnectDb()
	return res
}

export { getCandles }
