import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AuthDialog({ open, onOpenChange, onAuthed }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setError("");
      setMode("signin");
    }
  }, [open]);

  const upsertUser = (em, pw) => {
    const users = JSON.parse(localStorage.getItem("dp_users") || "[]");
    const existing = users.find((u) => u.email === em);
    if (existing) {
      existing.password = pw;
    } else {
      users.push({ email: em, password: pw });
    }
    localStorage.setItem("dp_users", JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const users = JSON.parse(localStorage.getItem("dp_users") || "[]");
    if (mode === "signup") {
      if (!email || !password) return setError("Enter email and password");
      if (users.some((u) => u.email === email))
        return setError("Account exists. Sign in instead.");
      upsertUser(email, password);
      localStorage.setItem("dp_session", JSON.stringify({ email }));
      onAuthed?.({ email });
      onOpenChange(false);
    } else {
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!user) return setError("Invalid credentials");
      localStorage.setItem("dp_session", JSON.stringify({ email }));
      onAuthed?.({ email });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "signup" ? "Create account" : "Sign in"}
          </DialogTitle>
          <DialogDescription>
            Local-only auth for demo purposes. No data leaves your browser.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-10 rounded-md bg-white/5 border border-white/10 px-3 text-white placeholder:text-white/50"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-10 rounded-md bg-white/5 border border-white/10 px-3 text-white placeholder:text-white/50"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="h-10 px-4 rounded-md bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-medium"
            >
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              className="text-sm text-white/70 hover:text-white"
            >
              {mode === "signup"
                ? "Have an account? Sign in"
                : "New here? Create account"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
