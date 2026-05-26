import { NextRequest, NextResponse } from "next/server"

const REALM = 'Basic realm="Dashboard", charset="UTF-8"'

export function middleware(req: NextRequest) {
  const password = process.env.APP_PASSWORD
  if (!password) return NextResponse.next()

  const header = req.headers.get("authorization")
  if (header?.startsWith("Basic ")) {
    const encoded = header.slice(6)
    try {
      const decoded = atob(encoded)
      const colon = decoded.indexOf(":")
      const given = colon >= 0 ? decoded.slice(colon + 1) : decoded
      if (given === password) return NextResponse.next()
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/cron).*)"],
}
