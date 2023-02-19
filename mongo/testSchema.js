import mongoose, { Schema } from "mongoose"

const testsSchema = new Schema({
	symbol: { type: String, required: true },
	interval: { type: Number, required: true },
	psar_increment: { type: Number, required: true },
	psar_max: { type: Number, required: true },
	bollinger_period: { type: Number, required: true },
	bollinger_deviation: { type: Number, required: true },
})

const Tests = mongoose.model("tests", testsSchema)

export { Tests }
