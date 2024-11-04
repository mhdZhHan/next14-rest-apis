import { NextResponse } from "next/server"
import { Types } from "mongoose"

import { connectDB } from "@/lib/db"
import Category from "@/lib/models/category.model"
import User from "@/lib/models/user.model"

export const GET = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get("userId")

		if (!userId) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "user id not provided",
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

		const user = await User.findById(userId)
		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			)
		}

		const categories = await Category.find({
			user: userId,
		})

		return NextResponse.json({ success: true, categories }, { status: 200 })
	} catch (error) {
		console.log("Error in get categories", error)

		return NextResponse.json({
			success: false,
			message: "Server error",
			error: error instanceof Error && error?.message,
		})
	}
}

export const POST = async (request: Request) => {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get("userId")

		console.log("HHHHH")

		const { title } = await request.json()

		if (!userId) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "user id not provided",
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

		const newCategory = new Category({ title, user: userId })
		await newCategory.save()

		return NextResponse.json(
			{ success: true, newCategory },
			{ status: 200 }
		)
	} catch (error) {
		console.log("Error in create category", error)

		return NextResponse.json({
			success: false,
			message: "Server error",
			error: error instanceof Error && error?.message,
		})
	}
}
