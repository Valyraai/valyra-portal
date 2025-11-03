import Link from "next/link";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { createClient } from "/workspaces/valyra-portal/valyra-portal/components/lib/supabaseServer";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <LoggedOut />;

  // Get org_id from profiles (id = auth.uid)
  const { data: prof } = await supabase
    .from("profiles")
    .select("org_id, full_name")
    .eq("id", user.id)
    .single();

  if (!prof?.org_id) return <div className="card">No organization linked.</div>;

  const { data: packs } = await supabase
    .from("content_packs")
    .select("id, status, created_at, mini_strategy")
    .eq("org_id", prof.org_id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Weekly Packs</h1>
      <div className="grid gap-4">
        {(packs ?? []).map((p: { id: Key | null | undefined; created_at: string | number | Date; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; mini_strategy: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <Link key={p.id} href={`/packs/${p.id}`} className="card block hover:shadow">
            <div className="text-sm text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Status: {p.status}</div>
              <div className="text-teal-700 text-sm line-clamp-2 max-w-[60%]">{p.mini_strategy}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LoggedOut() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <a className="btn btn-primary" href="/login">Continue</a>
    </div>
  );
}
