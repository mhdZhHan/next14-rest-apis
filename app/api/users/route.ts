import { NextResponse } from "next/server"

import { connectDB } from "@/lib/db"
import User from "@/lib/models/user.model"
import { Types } from "mongoose"

// get users
export const GET = async () => {
	try {
		await connectDB()
		const users = await User.find().select("-password")
		return new NextResponse(JSON.stringify(users))
	} catch (error) {
		console.log("Error in GET users", error)

		return NextResponse.json(
			{
				error: error instanceof Error && error.message,
				success: false,
				message: "Server error",
			},
			{ status: 500 }
		)
	}
}

// create new user
export const POST = async (request: Request) => {
	try {
		const body = await request.json()
		await connectDB()

		const newUser = new User(body)
		await newUser.save()

		return NextResponse.json(
			{
				success: true,
				message: "User created successfully",
				user: { ...newUser._doc, password: undefined },
			},
			{ status: 200 }
		)
	} catch (error) {
		console.log("Error in user creation", error)

		return NextResponse.json(
			{
				success: false,
				message: "Server error",
				error: error instanceof Error && error.message,
			},
			{ status: 500 }
		)
	}
}

// TODO later
export const PATCH = async () => {
	try {
	} catch (error) {
		console.log("Error in update user", error)

		return NextResponse.json(
			{
				success: false,
				message: "Server error",
				error: error instanceof Error && error.message,
			},
			{ status: 500 }
		)
	}
}

// delete user
export const DELETE = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get("userId")

		if (!userId) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "user id not fount",
				}),
				{ status: 400 }
			)
		}

		if (!Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({ success: false, message: "Invalid user id" }),
				{ status: 400 }
			)
		}

		await connectDB()

		const deletedUser = await User.findByIdAndDelete(
			new Types.ObjectId(userId) // or just the `userId`
		)

		if (!deletedUser) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "User not found",
				}),
				{ status: 400 }
			)
		} else {
			return new NextResponse(
				JSON.stringify({
					success: true,
					message: "User deleted successfully",
					user: deletedUser,
				}),
				{ status: 200 }
			)
		}
	} catch (error) {
		console.log("Error in delete user", error)

		return NextResponse.json(
			{
				success: false,
				message: "Server error",
				error: error instanceof Error && error.message,
			},
			{ status: 500 }
		)
	}
}
