import { NextResponse } from "next/server";
import { createClient } from "/workspaces/valyra-portal/valyra-portal/components/lib/supabaseServer";

export async function GET() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "https://portal.valyra.app"));
}
