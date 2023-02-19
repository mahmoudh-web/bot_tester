import tulind from "tulind"
import { formatCandles } from "../historical/formatCandles.js"

const atr = (candles, period) => {
	const { open, high, low, close, volume } = formatCandles(candles)
	const data = []
	tulind.indicators.atr.indicator(
		[high, low, close],
		[period],
		(err, results) => {
			if (err) console.log(err)
			results[0].forEach(res => data.push(res))
		}
	)
	return data
}

const macd = (candles, settings) => {
	const { open, high, low, close, volume } = formatCandles(candles)
	const macdLine = []
	const macdSignal = []
	const histogram = []

	tulind.indicators.macd.indicator(
		[close],
		[settings.short, settings.long, settings.signal],
		(err, results) => {
			if (err) console.log(err)
			results[0].forEach(res => macdLine.push(res))
			results[1].forEach(res => macdSignal.push(res))
			results[2].forEach(res => histogram.push(res))
		}
	)
	return { macdLine, macdSignal, histogram }
}

const sma = (candles, period) => {
	const { open, high, low, close, volume } = formatCandles(candles)
	const smaOutput = []

	tulind.indicators.sma.indicator([close], [period], (err, results) => {
		if (err) console.log(err)
		results[0].forEach(res => smaOutput.push(res))
	})
	return smaOutput
}

const indicatorSma = (candles, period) => {
	const smaOutput = []

	tulind.indicators.sma.indicator([candles], [period], (err, results) => {
		if (err) console.log(err)
		results[0].forEach(res => smaOutput.push(res))
	})
	return smaOutput
}

const psar = (candles, settings) => {
	const { open, high, low, close, volume } = formatCandles(candles)
	const output = []

	tulind.indicators.psar.indicator(
		[high, low],
		[settings.increment, settings.max],
		(err, results) => {
			if (err) console.log(err)
			results[0].forEach(res => output.push(res))
		}
	)

	return output
}

const bollinger = (candles, settings) => {
	const { open, high, low, close, volume } = formatCandles(candles)

	const upper = []
	const lower = []
	const middle = []

	tulind.indicators.bbands.indicator(
		[close],
		[settings.period, settings.deviation],
		(err, results) => {
			if (err) console.log(err)
			results[0].forEach(res => lower.push(res))
			results[1].forEach(res => middle.push(res))
			results[2].forEach(res => upper.push(res))
		}
	)

	return { lower, middle, upper }
}

export { atr, macd, sma, psar, indicatorSma, bollinger }
