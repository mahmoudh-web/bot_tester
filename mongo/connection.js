import mongoose from "mongoose"

const connectDb = async () => {
	console.log("connecting to data db")
	// connect to db
	mongoose.set("strictQuery", true)
	await mongoose.connect(process.env.DATABASE_URL)
}

const connectTestsDb = async () => {
	console.log("connecting to data db")
	// connect to db
	mongoose.set("strictQuery", true)
	await mongoose.connect(process.env.TESTS_URL)
}

const disconnectDb = () => {
	console.log(`disconnecting from db`)
	mongoose.disconnect()
}

export { connectDb, connectTestsDb, disconnectDb }
