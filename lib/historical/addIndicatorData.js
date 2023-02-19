import { reverse, min } from "lodash-es"

const addIndicatorData = (candles, ...data) => {
	const candleData = reverse(candles)
	const lengths = []

	data.forEach(indicator => {
		const indicatorData = reverse(indicator.data)
		const name = indicator.name
		lengths.push(indicatorData.length)

		for (let i = 0; i < indicatorData.length; i++) {
			candleData[i][name] = indicatorData[i]
		}
	})

	const trimTo = min(lengths)

	do {
		candleData.pop()
	} while (candleData.length > trimTo)

	return reverse(candleData)
}

export { addIndicatorData }
