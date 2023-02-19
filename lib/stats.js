import fs from "fs"

fs.writeFile(`./stats.csv`, "", err => console.log(err))

const writeA = fs.createWriteStream("./stats.csv", {
	encoding: "utf-8",
})

writeA.write(
	`time,openPrice,target,stopLoss,closed,direction,closeTime,closePrice,profit,balance\n`
)

const stats = trades => {
	let winning = 0
	let losing = 0
	const total = trades.length
	let balance = 0

	trades.forEach(trade => {
		if (trade.profit > 0) winning += 1
		if (trade.profit < 0) losing += 1
		balance += trade.profit
		writeA.write(
			`${trade.time},${trade.openPrice},${trade.target},${trade.stopLoss},${trade.closed},${trade.direction},${trade.closeTime},${trade.closePrice},${trade.profit},${balance}\n`
		)
	})

	writeA.close()
}

export { stats }
