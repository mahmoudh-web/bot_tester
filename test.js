import { getCandles } from "./lib/historical/getCandles.js"
import { kline_1m } from "./mongo/schema.js"

import * as dotenv from "dotenv"
import { connectDb } from "./mongo/connection.js"
import mongoose from "mongoose"
dotenv.config()
await connectDb()
const candles = await getCandles("BTCUSDT", 1)
console.log(candles.length)

mongoose.disconnect()
