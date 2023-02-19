import * as dotenv from "dotenv"
dotenv.config()

import { runSarBollinger } from "./runSarBollinger.js"
import { Tests, Results } from "../mongo/schema.js"
import { connectDb } from "../mongo/connection.js"

let processing = false

const runTest = async () => {
	if (processing) return

	processing = true
	// get job
	await connectDb()
	const job = await Tests.findOne({ completed: false })

	// process job
	if (job) {
		const id = job.testId
		await Tests.updateOne({ testId: id }, { completed: true })
		const results = await runSarBollinger(job.symbol, job.interval, {
			psar: { increment: job.psar_increment, max: job.psar_max },
			bollinger: {
				period: job.bollinger_period,
				deviation: job.bollinger_deviation,
			},
		})

		const testData = {
			testId: id,
			buys: results.buys,
			sells: results.sells,
			losing: results.losing,
			usdt_balance: results.usdt.toFixed(2),
			token_balance: results.token.toFixed(10),
			win_rate: results.winRate,
			lose_rate: results.loseRate,
			profit: results.profit,
		}

		await Results.create(testData)
	}
	processing = false
}

await runTest()
setInterval(runTest, 10000)

// await sarBollinger("BTCUSDT", 3, {
// 	psar: { increment: 0.2, max: 0.4 },
// 	// macd: { short: 5, long: 8, signal: 9 },
// 	bollinger: { period: 3, deviation: 0.5 },
// })

// mongoose.disconnect()
