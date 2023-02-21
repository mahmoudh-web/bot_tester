import mongoose from "mongoose"

const instrumentSchema = new mongoose.Schema({
	symbol: { type: String, unique: true },
	status: String,
	baseAsset: String,
	baseAssetPrecision: Number,
	quoteAsset: String,
	quotePrecision: Number,
	quoteAssetPrecision: Number,
	orderTypes: Array,
	icebergAllowed: Boolean,
	ocoAllowed: Boolean,
	quoteOrderQtyMarketAllowed: Boolean,
	allowTrailingStop: Boolean,
	cancelReplaceAllowed: Boolean,
	isSpotTradingAllowed: Boolean,
	isMarginTradingAllowed: Boolean,
	filters: Array,
	permissions: Array,
	defaultSelfTradePreventionMode: String,
	allowedSelfTradePreventionModes: Array,
	download: { type: Boolean, default: false },
})

const kline_1mSchema = new mongoose.Schema({
	startTime: { type: Number, required: true },
	closeTime: { type: Number, required: true },
	startTimeISO: { type: Date, required: true },
	closeTimeISO: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	quoteAssetVolume: { type: Number, required: true },
	takerBuyBaseAssetVolume: { type: Number, required: true },
	takerBuyQuoteAssetVolume: { type: Number, required: true },
	identifier: { type: String, required: true, unique: true },
	symbol: { type: String, required: true, index: true },
})

const kline_3mSchema = new mongoose.Schema({
	startTime: { type: Number, required: true },
	closeTime: { type: Number, required: true },
	startTimeISO: { type: Date, required: true },
	closeTimeISO: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	quoteAssetVolume: { type: Number, required: true },
	takerBuyBaseAssetVolume: { type: Number, required: true },
	takerBuyQuoteAssetVolume: { type: Number, required: true },
	identifier: { type: String, required: true, unique: true },
	symbol: { type: String, required: true, index: true },
})

const kline_5mSchema = new mongoose.Schema({
	startTime: { type: Number, required: true },
	closeTime: { type: Number, required: true },
	startTimeISO: { type: Date, required: true },
	closeTimeISO: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	quoteAssetVolume: { type: Number, required: true },
	takerBuyBaseAssetVolume: { type: Number, required: true },
	takerBuyQuoteAssetVolume: { type: Number, required: true },
	identifier: { type: String, required: true, unique: true },
	symbol: { type: String, required: true, index: true },
})

const kline_15mSchema = new mongoose.Schema({
	startTime: { type: Number, required: true },
	closeTime: { type: Number, required: true },
	startTimeISO: { type: Date, required: true },
	closeTimeISO: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	quoteAssetVolume: { type: Number, required: true },
	takerBuyBaseAssetVolume: { type: Number, required: true },
	takerBuyQuoteAssetVolume: { type: Number, required: true },
	identifier: { type: String, required: true, unique: true },
	symbol: { type: String, required: true, index: true },
})

const kline_1hSchema = new mongoose.Schema({
	startTime: { type: Number, required: true },
	closeTime: { type: Number, required: true },
	startTimeISO: { type: Date, required: true },
	closeTimeISO: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	quoteAssetVolume: { type: Number, required: true },
	takerBuyBaseAssetVolume: { type: Number, required: true },
	takerBuyQuoteAssetVolume: { type: Number, required: true },
	identifier: { type: String, required: true, unique: true },
	symbol: { type: String, required: true, index: true },
})

const queueSchema = new mongoose.Schema({
	symbol: { type: String, required: true },
	timeframe: { type: String, required: true },
	start: { type: Number, required: true },
	end: { type: Number, required: true },
	endISO: { type: Date, required: true },
	startISO: { type: Date, required: true },
	active: { type: Boolean, default: false },
})

const testsSchema = new mongoose.Schema({
	testId: { type: String, required: true },
	symbol: { type: String, required: true },
	interval: { type: Number, required: true },
	psar_increment: { type: Number, required: true },
	psar_max: { type: Number, required: true },
	bollinger_period: { type: Number, required: true },
	bollinger_deviation: { type: Number, required: true },
	completed: Boolean,
})

const testResultsSchema = new mongoose.Schema({
	symbol: { type: String, required: true },
	interval: { type: Number, required: true },
	testId: { type: String, required: true },
	buys: { type: Number, required: true },
	sells: { type: Number, required: true },
	losing: { type: Number, required: true },
	usdt_balance: { type: Number, required: true },
	token_balance: { type: Number, required: true },
	win_rate: { type: Number, required: true },
	lose_rate: { type: Number, required: true },
	profit: { type: Number, required: true },
})

const Results =
	mongoose.models.results || mongoose.model("results", testResultsSchema)
const Tests = mongoose.models.tests || mongoose.model("tests", testsSchema)
const Instrument = mongoose.model("instrument", instrumentSchema)
const Queue = mongoose.model("download_queue", queueSchema)
const kline_1m = mongoose.model("kline_1m", kline_1mSchema)
const kline_3m = mongoose.model("kline_3m", kline_3mSchema)
const kline_5m = mongoose.model("kline_5m", kline_5mSchema)
const kline_15m = mongoose.model("kline_15m", kline_15mSchema)
const kline_1h = mongoose.model("kline_1h", kline_1hSchema)

export {
	Instrument,
	Queue,
	kline_1m,
	kline_3m,
	kline_5m,
	kline_15m,
	kline_1h,
	Tests,
	Results,
}
