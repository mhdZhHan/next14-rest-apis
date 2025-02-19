import { model, Schema, models } from "mongoose"

const blogSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		user: { type: Schema.Types.ObjectId, ref: "User" },
		Category: { type: Schema.Types.ObjectId, ref: "Category" },
	},
	{ timestamps: true }
)

const Blog = models.Blog || model("Blog", blogSchema)
export default Blog
