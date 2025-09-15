import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/common/Reveal";

function TiltCard({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onMove(e) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    }
    function reset() {
      el.style.transform = "rotateX(0) rotateY(0)";
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="transition-transform will-change-transform rounded-xl border border-white/10 bg-white/5 p-6"
    >
      {children}
    </div>
  );
}

function CountUp({ to = 100, duration = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let start;
    let r;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setN(Math.round(p * to));
      if (p < 1) r = requestAnimationFrame(step);
    }
    r = requestAnimationFrame(step);
    return () => cancelAnimationFrame(r);
  }, [to, duration]);
  return <span>{n}</span>;
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-[calc(100vh-4rem)] isolate overflow-hidden bg-[#0a0112]">

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Build stunning portfolios in minutes
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl">
            DigiPratibha is a no‑code portfolio builder with drag‑and‑drop, four
            beautiful templates, one‑click hosting, PDF export, and simple user
            management.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/builder"
              className="inline-flex h-11 items-center justify-center rounded-md bg-fuchsia-500 px-6 text-white font-medium hover:bg-fuchsia-400"
            >
              Start Building
            </Link>
            <a
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-md bg-white/10 px-6 text-white font-medium hover:bg-white/20"
            >
              Explore Features
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 text-white/80">
            <div>
              <div className="text-3xl font-extrabold text-white">
                <CountUp to={4} />
              </div>
              <div className="text-sm">Templates</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">
                <CountUp to={1} />
              </div>
              <div className="text-sm">Click to Host</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">
                <CountUp to={60} />
              </div>
              <div className="text-sm">Second Setup</div>
            </div>
          </div>
        </div>
        <TiltCard>
          <div className="rounded-lg bg-[#0d0b12] p-6 text-white shadow-2xl">
            <h3 className="text-fuchsia-400 font-semibold">DigiPratibha</h3>
            <p className="text-white/80 mt-2">Digital Portfolio for Students</p>
            <p className="text-white/60 mt-4">
              No‑code platform for students to build and share portfolios.
            </p>
            <div className="mt-6">
              <h4 className="font-semibold">Must‑Have Features:</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-white/80">
                <li>Drag‑and‑Drop Builder</li>
                <li>4 Templates</li>
                <li>One‑Click Hosting</li>
                <li>PDF Export</li>
                <li>User Management</li>
              </ul>
            </div>
          </div>
        </TiltCard>
      </section>

      {/* Interactive Templates Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-white text-2xl font-semibold mb-6">
          Pick a template and make it yours
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {["Classic","Minimal","Bold","Timeline"].map((t) => (
            <TiltCard key={t}>
              <div className="text-white">
                <div className="font-semibold">{t}</div>
                <p className="text-white/70 text-sm mt-1">Hover to preview tilt effect</p>
                <button onClick={() => navigate('/builder')} className="mt-4 h-9 px-3 rounded-md bg-fuchsia-500 hover:bg-fuchsia-400 text-white">Use Template</button>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 grid md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Drag & Drop",
            desc: "Arrange sections visually with instant preview.",
          },
          {
            title: "4 Templates",
            desc: "Classic, Minimal, Bold, and Timeline to start fast.",
          },
          {
            title: "One‑click Hosting",
            desc: "Deploy via Netlify or Vercel integrations.",
          },
          {
            title: "PDF Export",
            desc: "Share offline or attach to applications.",
          },
          {
            title: "User Management",
            desc: "Local accounts to save and resume work.",
          },
          {
            title: "Responsive",
            desc: "Looks great on phones, tablets, and desktops.",
          },
        ].map((f, i) => (
          <Reveal key={f.title} delay={i * 80}>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/90 hover:bg-white/10 transition-colors">
              <h3 className="text-white font-semibold">{f.title}</h3>
              <p className="text-white/70 mt-2">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* How it works */}
      <section
        id="how"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12"
      >
        <h2 className="text-white text-2xl font-semibold mb-6">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Choose a template",
              desc: "Start from one of our four presets.",
            },
            {
              step: "2",
              title: "Customize",
              desc: "Drag blocks, edit text, reorder sections.",
            },
            {
              step: "3",
              title: "Publish",
              desc: "Export PDF or deploy with one click.",
            },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 90}>
              <div className="relative rounded-xl border border-white/10 bg-white/5 p-6 overflow-hidden">
                <div className="absolute -top-10 -right-10 size-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
                <div className="text-fuchsia-300 text-sm">Step {s.step}</div>
                <div className="text-white font-semibold mt-1">{s.title}</div>
                <p className="text-white/70 mt-2 text-sm">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why DigiPratibha */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[.03] p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Reveal>
              <div>
                <h3 className="text-white text-2xl font-semibold">
                  Why DigiPratibha?
                </h3>
                <p className="text-white/70 mt-3">
                  Built for students and early professionals to showcase
                  achievements quickly. No coding required, just creativity.
                </p>
                <ul className="mt-4 space-y-2 text-white/80 list-disc pl-5">
                  <li>Pixel‑perfect templates with responsive design</li>
                  <li>Instant hosting with Netlify or Vercel</li>
                  <li>Portable PDF export for applications</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="rounded-xl bg-[#0d0b12] p-6 text-white">
                <div className="text-sm text-white/70">Live preview</div>
                <div className="mt-2 h-40 rounded-md bg-white/5 animate-pulse" />
                <div className="mt-4 flex gap-3">
                  <Link
                    to="/builder"
                    className="h-10 px-4 rounded-md bg-fuchsia-500 hover:bg-fuchsia-400 text-white"
                  >
                    Open Builder
                  </Link>
                  <a
                    href="#features"
                    className="h-10 px-4 rounded-md bg-white/10 hover:bg-white/20 text-white"
                  >
                    See Features
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
