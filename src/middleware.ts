import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api")) {
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
      // error,
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({}, { status: 401 });
    }
  }

  return res;
}
