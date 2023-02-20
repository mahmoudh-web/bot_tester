import * as dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import * as csv from "fast-csv"
import { getCandles } from "../lib/historical/getCandles.js"
import { getInstruments } from "../lib/historical/getInstruments.js"

const writeCsv = async (symbol, interval) => {
	const candles = await getCandles(symbol, interval)
	const filename = `./tests/files/${symbol}_${interval}.csv`
	const header = `start,startISO,open,high,low,close,volume\n`
	const file = fs.createWriteStream(filename)
	file.write(header)

	candles.forEach(candle => {
		file.write(
			`${candle.start},${candle.startISO},${candle.open},${candle.high},${candle.low},${candle.close},${candle.volume}\n`
		)
	})

	return true
}

const writeCsvSync = async (symbol, interval) => {
	const candles = await getCandles(symbol, interval)
	const filename = `./tests/files/${symbol}_${interval}.csv`
	let data = `start,startISO,open,high,low,close,volume\n`
	candles.forEach(
		candle =>
			(data += `${candle.start},${candle.startISO},${candle.open},${candle.high},${candle.low},${candle.close},${candle.volume}\n`)
	)
	fs.writeFileSync(filename, data)
}

const readCandles = async filename => {
	console.log(filename)
	return new Promise((resolve, reject) => {
		const candles = []

		fs.createReadStream(filename)
			.pipe(csv.parse({ headers: true }))
			.on("error", reject)
			.on("data", row => {
				candles.push(row)
			})
			.on("end", () => resolve(candles))
	})
}

export { writeCsv, readCandles, writeCsvSync }
