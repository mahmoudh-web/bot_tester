import * as dotenv from "dotenv"
import { chunk } from "lodash-es"
dotenv.config()

import { getInstruments } from "./lib/historical/getInstruments.js"
import { connectDb } from "./mongo/connection.js"
import mongoose from "mongoose"
import { Tests } from "./mongo/schema.js"
import { nanoid } from "nanoid"

// get instruments
const instruments = await getInstruments()
const intervals = [1, 3, 5, 15, 60]

// create tests
const tests = []

const createTests = () => {
	instruments.forEach(instrument => {
		intervals.forEach(interval => {
			for (
				let psar_increment = 0.1;
				psar_increment < 0.31;
				psar_increment += 0.1
			) {
				for (let psar_max = 0.4; psar_max < 0.6; psar_max += 0.1) {
					for (
						let bollinger_period = 2;
						bollinger_period < 50;
						bollinger_period += 2
					) {
						for (
							let bollinger_deviation = 0.5;
							bollinger_deviation < 1.25;
							bollinger_deviation += 0.5
						) {
							const testSettings = {
								symbol: instrument.symbol,
								completed: false,
								interval,
								psar_increment,
								psar_max,
								bollinger_period,
								bollinger_deviation:
									bollinger_deviation.toFixed(1),
							}
							console.log(
								`created test for ${instrument.symbol} ${interval}`
							)
							tests.push(testSettings)
						}
					}
				}
			}
		})
	})
}

const saveTest = async tests => {
	await connectDb()

	const chunked = chunk(tests, 5000)
	let x = 1
	for await (let chunks of chunked) {
		console.log(`writing chunk ${x} of ${chunked.length}`)
		x += 1
		await Tests.create(chunks)
	}
}

createTests()

if (tests.length) {
	console.log(`${tests.length} tests`)
	tests.forEach(test => {
		const id = nanoid()
		console.log(id)
		test.testId = id
		console.log(test)
	})
	await saveTest(tests)
}
mongoose.disconnect()
