import mongoose from "mongoose"

export const connectDB = async () => {
	const connectionState = mongoose.connection.readyState

	if (connectionState === 1) {
		console.log("MongoDB Already connected.")
		return
	}

	if (connectionState === 2) {
		console.log("MongoDB Connecting...")
		return
	}

	try {
		const conn = await mongoose.connect(process.env.MONGO_URI!, {
			dbName: "my_db",
			bufferCommands: true,
		})
		console.log(`MongoDB Connected ${conn.connection.host}`)
	} catch (error) {
		console.log("MongoDB Connection error", error)
		process.exit(1) // => exit process with failure
	}
}
