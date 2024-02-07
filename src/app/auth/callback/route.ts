import {
  saveAccessTokenToCookie,
  saveRefreshTokenToCookie,
} from "@/services/spotify/auth";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  saveAccessTokenToCookie(session?.provider_token as string);
  saveRefreshTokenToCookie(session?.provider_refresh_token as string);

  return NextResponse.redirect(new URL("/", req.url));
}
