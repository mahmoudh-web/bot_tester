import mongoose from "mongoose"
import { connectDb, disconnectDb } from "../../mongo/connection.js"
import { Instrument } from "../../mongo/schema.js"

const getInstruments = async () => {
	console.log("Getting Instruments from Db")
	await connectDb()

	const instruments = await Instrument.find({
		download: true,
		quoteAsset: "USDT",
		isSpotTradingAllowed: true,
		status: "TRADING",
	}).sort({ symbol: 1 })

	// mongoose.disconnect()
	disconnectDb()
	return instruments
}

export { getInstruments }
