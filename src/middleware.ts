import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')
    const isPublicRoute = req.nextUrl.pathname.startsWith('/public') || req.nextUrl.pathname === '/login'

    if (isAuthRoute || isPublicRoute) {
        return
    }

    if (!isLoggedIn) {
        return Response.redirect(new URL('/api/auth/signin', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|$).*)"],
}
