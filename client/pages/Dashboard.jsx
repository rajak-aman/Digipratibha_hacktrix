import { useEffect, useMemo, useState } from "react";
import { getActivity, summarizeActivityByDay } from "@/lib/activity";
import { getStats } from "@/lib/profile";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const [activity, setActivity] = useState(getActivity());
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    const onStorage = () => {
      setActivity(getActivity());
      setStats(getStats());
    };
    window.addEventListener("storage", onStorage);
    const t = setInterval(() => setActivity(getActivity()), 2000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
  }, []);

  const daily = useMemo(() => summarizeActivityByDay(), [activity]);
  const totals = useMemo(() => {
    const t = { add_block: 0, remove_block: 0, reorder_block: 0, export_pdf: 0, download_html: 0 };
    for (const a of activity) if (t[a.type] !== undefined) t[a.type]++;
    return Object.entries(t).map(([name, count]) => ({ name, count }));
  }, [activity]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0a0112] text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold">Dashboard</h1>
        <p className="text-white/70">Overview of your activity and usage.</p>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
            <h2 className="font-semibold">Activity trend</h2>
            <div className="h-64 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff14" vertical={false} />
                  <XAxis dataKey="day" stroke="#bbb" tick={{ fill: '#bbb', fontSize: 12 }} />
                  <YAxis stroke="#bbb" tick={{ fill: '#bbb', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0d0b12', border: '1px solid #2a2630', color: '#fff' }} />
                  <Area type="monotone" dataKey="events" stroke="#a855f7" fillOpacity={1} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Quick stats</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/10 p-4"><div className="text-2xl font-extrabold">{stats.pdfExports || 0}</div><div className="text-white/70 text-sm">PDF Exports</div></div>
              <div className="rounded-lg bg-white/10 p-4"><div className="text-2xl font-extrabold">{stats.htmlDownloads || 0}</div><div className="text-white/70 text-sm">HTML Downloads</div></div>
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
            <h2 className="font-semibold">Events breakdown</h2>
            <div className="h-60 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={totals}>
                  <CartesianGrid stroke="#ffffff14" vertical={false} />
                  <XAxis dataKey="name" stroke="#bbb" tick={{ fill: '#bbb', fontSize: 12 }} />
                  <YAxis stroke="#bbb" tick={{ fill: '#bbb', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0d0b12', border: '1px solid #2a2630', color: '#fff' }} />
                  <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Recent activity</h2>
            <ul className="mt-3 space-y-2 max-h-60 overflow-auto pr-1">
              {activity.slice(0, 20).map((a) => (
                <li key={a.id} className="text-sm text-white/80">
                  <span className="text-white/60">{new Date(a.ts).toLocaleString()} — </span>
                  <span className="font-medium">{a.type}</span>{" "}
                  {a.payload?.type && <span className="text-white/60">({a.payload.type})</span>}
                </li>
              ))}
              {!activity.length && <li className="text-white/60">No activity yet</li>}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
