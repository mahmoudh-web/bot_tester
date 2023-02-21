import { getCandles } from "./lib/historical/getCandles.js"
import { kline_1m } from "./mongo/schema.js"

import * as dotenv from "dotenv"
import { connectDb } from "./mongo/connection.js"
import mongoose from "mongoose"
import { DateTime } from "luxon"
dotenv.config()

const start = DateTime.now()
const candles = await getCandles("BTCUSDT", 1)
const end = DateTime.now()
console.log(candles.length)
console.log(end.diff(start).toHuman())

mongoose.disconnect()
