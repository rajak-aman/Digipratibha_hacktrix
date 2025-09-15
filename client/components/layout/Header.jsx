import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PublishDialog from "@/components/modals/PublishDialog";
import AuthDialog from "@/components/modals/AuthDialog";
import { useI18n } from "@/i18n/i18n";

const navLink = (to, label, pathname) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === to
        ? "bg-white/10 text-white"
        : "text-white/80 hover:text-white"
    }`}
  >
    {label}
  </Link>
);

export default function Header() {
  const { pathname } = useLocation();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [openPublish, setOpenPublish] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("dp_session") || "null");
    setUser(u);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("dp_session");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0112]/80 to-transparent backdrop-blur supports-[backdrop-filter]:bg-[#0a0112]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Digi</span>
            <span className="text-fuchsia-400">Pratibha</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", t("home"), pathname)}
            {navLink("/builder", t("builder"), pathname)}
            {navLink("/dashboard", t("dashboard"), pathname)}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenPublish(true)}
            className="hidden sm:inline-flex h-10 px-4 items-center justify-center rounded-md bg-fuchsia-500 text-white font-medium hover:bg-fuchsia-400 transition-colors"
          >
            One‑click Hosting
          </button>
          <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)} className="h-10 rounded-md bg-white/10 text-white px-2">
            <option value="en">EN</option>
            <option value="hi">हिं</option>
          </select>
          <Link
            to="/profile"
            className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white"
          >
            <div className="size-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              {(() => {
                try {
                  const p =
                    JSON.parse(localStorage.getItem("dp_profile")) || {};
                  return p.photo ? (
                    <img
                      src={p.photo}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs">DP</span>
                  );
                } catch {
                  return <span className="text-xs">DP</span>;
                }
              })()}
            </div>
            <span className="text-sm">Profile</span>
          </Link>
          <button
            onClick={() => (user ? handleSignOut() : setOpenAuth(true))}
            className="h-10 px-4 rounded-md bg-white/10 text-white hover:bg-white/20 transition"
          >
            {user ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>
      <PublishDialog open={openPublish} onOpenChange={setOpenPublish} />
      <AuthDialog
        open={openAuth}
        onOpenChange={setOpenAuth}
        onAuthed={setUser}
      />
    </header>
  );
}
