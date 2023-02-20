import * as dotenv from "dotenv"
dotenv.config()

import { Tests } from "../mongo/schema.js"
await Tests.update({ completed: true }, { completed: false })
