import { createClient } from "/workspaces/valyra-portal/valyra-portal/components/lib/supabaseServer";

export default async function PackPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="card">Please <a className="text-teal-700 underline" href="/login">login</a>.</div>;

  const { data: prof } = await supabase.from("profiles").select("org_id, email").eq("id", user.id).single();
  if (!prof?.org_id) return <div className="card">No organization linked.</div>;

  const { data: pack } = await supabase
    .from("content_packs")
    .select("id, org_id, status, mini_strategy, created_at")
    .eq("id", params.id).eq("org_id", prof.org_id).single();

  if (!pack) return <div className="card">Pack not found.</div>;

  const makeWebhook = process.env.MAKE_APPROVAL_WEBHOOK!;
  const qsBase = `pack_id=${pack.id}&org_id=${pack.org_id}&actor_email=${encodeURIComponent(prof.email || "")}`;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-sm text-gray-500">{new Date(pack.created_at).toLocaleString()}</div>
        <h1 className="text-2xl font-semibold">Weekly Pack</h1>
        <div className="whitespace-pre-wrap text-gray-800 mt-2">{pack.mini_strategy || "No summary yet."}</div>
        <div className="mt-6 flex gap-3">
          <a className="btn btn-primary"
             href={`${makeWebhook}?action=approve&${qsBase}`}>
            ✅ Approve Pack
          </a>
          <form action={makeWebhook} method="GET" className="flex gap-2">
            <input type="hidden" name="action" value="changes" />
            <input type="hidden" name="pack_id" value={pack.id} />
            <input type="hidden" name="org_id" value={String(pack.org_id)} />
            <input type="hidden" name="actor_email" value={prof.email || ""} />
            <input name="reason" placeholder="Why? (optional)" className="border rounded-lg px-3 py-2 text-sm min-w-[280px]" />
            <button className="btn btn-ghost">✖ Request changes</button>
          </form>
        </div>
      </div>

      {/* TODO: render items when we generate them */}
      {/* e.g., list content_items for this pack */}
    </div>
  );
}
