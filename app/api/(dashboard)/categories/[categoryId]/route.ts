import { NextResponse } from "next/server"
import { Types } from "mongoose"

import { connectDB } from "@/lib/db"
import Category from "@/lib/models/category.model"
import User from "@/lib/models/user.model"

export const PATCH = async (
	request: Request,
	context: { params: { categoryId: string } }
) => {
	try {
		const categoryId = context.params.categoryId

		const { searchParams } = new URL(request.url)
		const userId = searchParams.get("userId")

		const { title } = await request.json()

		if (!categoryId) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "Category not provided",
				}),
				{ status: 400 }
			)
		}

		if (!Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "Invalid Category id",
				}),
				{ status: 400 }
			)
		}

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "User id not fount",
				}),
				{ status: 404 }
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

		const category = await Category.findOne({
			_id: categoryId,
			user: userId,
		})

		if (!category) {
			return NextResponse.json(
				{
					success: false,
					message: "Category not found or doesn't belong to the user",
				},
				{ status: 404 }
			)
		}

		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			{
				title,
			},
			{ new: true }
		)

		return NextResponse.json(
			{ success: true, updatedCategory },
			{ status: 200 }
		)
	} catch (error) {
		console.log("Error in update category", error)

		return NextResponse.json({
			success: false,
			message: "Server error",
			error: error instanceof Error && error?.message,
		})
	}
}

export const DELETE = async (
	request: Request,
	context: { params: { categoryId: string } }
) => {
	try {
		const categoryId = context.params.categoryId

		const { searchParams } = new URL(request.url)
		const userId = searchParams.get("userId")

		if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "Invalid category id",
				}),
				{ status: 400 }
			)
		}

		if (!userId || !Types.ObjectId.isValid(userId)) {
			return new NextResponse(
				JSON.stringify({
					success: false,
					message: "Invalid user id",
				}),
				{ status: 400 }
			)
		}

		await connectDB()

		const user = await User.findById(userId)
		const category = await Category.findOne({
			_id: categoryId,
			user: userId,
		})

		if (!category) {
			return NextResponse.json(
				{
					success: false,
					message: "Category not found or doesn't belong to the user",
				},
				{ status: 404 }
			)
		}

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found",
				},
				{ status: 404 }
			)
		}

		const deletedCategory = await Category.findByIdAndDelete(categoryId)

		return NextResponse.json(
			{ success: true, deletedCategory },
			{ status: 200 }
		)
	} catch (error) {
		console.log("Error in delete category", error)

		return NextResponse.json({
			success: false,
			message: "Server error",
			error: error instanceof Error && error?.message,
		})
	}
}
