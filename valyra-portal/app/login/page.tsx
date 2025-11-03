"use client";
import { createBrowserSupabase } from "/workspaces/valyra-portal/valyra-portal/components/lib/supabaseBrowser";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Login() {
  const supabase = createBrowserSupabase();
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Sign in to Valyra</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={typeof window !== "undefined" ? `${window.location.origin}/` : ""}
      />
    </div>
  );
}
