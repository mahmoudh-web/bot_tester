import * as dotenv from "dotenv"
dotenv.config()

import { Tests } from "../mongo/schema.js"

const data = await Tests.find({ completed: true })
console.log(data.length)
// await Tests.updateMany({ completed: true }, { completed: false })
