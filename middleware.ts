import { NextResponse } from "next/server"
import { authMiddleware } from "./middlewares/api/auth.middleware"

export const config = {
	matcher: "/api/:path*",
}

export default function middleware(request: Request) {
	const authResult = authMiddleware(request)

	if (!authResult?.isValidate && request.url.includes("/api/blogs")) {
		return NextResponse.json(
			{
				success: false,
				message: "Unauthorized",
			},
			{ status: 401 }
		)
	}
	return NextResponse.next()
}
