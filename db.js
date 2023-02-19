import * as dotenv from "dotenv"
dotenv.config()

import { connectDb, disconnectDb } from "./mongo/connection.js"
import {
	kline_1m,
	kline_3m,
	kline_5m,
	kline_15m,
	kline_1h,
} from "./mongo/schema.js"

import { DateTime } from "luxon"
import mongoose from "mongoose"
await connectDb()
const startIndex = DateTime.now()
const minuteIndex = await kline_1m.find({ identifier: { $regex: "^BTCUSDT" } })
const endIndex = DateTime.now()
const elapseIndex = endIndex.diff(startIndex).toHuman()
console.log(`With Index: ${elapseIndex}`)

const startNoIndex = DateTime.now()
const minuteNoIndex = await kline_1m.find({ symbol: "BTCUSDT" })
const endNoIndex = DateTime.now()
const elapseNoIndex = endIndex.diff(startIndex).toHuman()
console.log(`Without Index: ${elapseNoIndex}`)

mongoose.disconnect()
