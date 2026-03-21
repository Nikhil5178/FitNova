import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  onSuccess?: () => void;
}

const ACCENT = "oklch(0.65 0.22 240)";
const DARK_BG = "oklch(0.10 0.01 260)";

function getUsers(): Record<
  string,
  { name: string; email: string; password: string }
> {
  try {
    return JSON.parse(localStorage.getItem("fittrack_users") || "{}");
  } catch {
    return {};
  }
}

export function AuthModal({
  open,
  onClose,
  defaultTab = "login",
  onSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = Object.values(users).find(
        (u) => u.email === loginEmail && u.password === loginPassword,
      );
      if (!user) {
        toast.error("Invalid email or password.");
        setLoginLoading(false);
        return;
      }
      localStorage.setItem(
        "fittrack_session",
        JSON.stringify({ name: user.name, email: user.email }),
      );
      toast.success(`Welcome back, ${user.name}!`);
      setLoginLoading(false);
      onClose();
      onSuccess?.();
      window.location.reload();
    }, 600);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setRegLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const exists = Object.values(users).some((u) => u.email === regEmail);
      if (exists) {
        toast.error("An account with this email already exists.");
        setRegLoading(false);
        return;
      }
      const id = crypto.randomUUID();
      users[id] = { name: regName, email: regEmail, password: regPassword };
      localStorage.setItem("fittrack_users", JSON.stringify(users));
      localStorage.setItem(
        "fittrack_session",
        JSON.stringify({ name: regName, email: regEmail }),
      );
      toast.success(`Account created! Welcome, ${regName}!`);
      setRegLoading(false);
      onClose();
      onSuccess?.();
      window.location.reload();
    }, 600);
  }

  const inputStyle: React.CSSProperties = {
    background: "oklch(0.14 0.02 260)",
    border: "1px solid oklch(0.25 0.05 260)",
    color: "oklch(0.92 0.01 260)",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="auth.dialog"
        className="p-0 overflow-hidden border-0 max-w-md"
        style={{
          background: DARK_BG,
          border: `1px solid ${ACCENT}50`,
          boxShadow: `0 0 60px ${ACCENT}25, 0 0 120px ${ACCENT}10`,
        }}
      >
        {/* Glow top bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          }}
        />

        <div className="px-8 pt-6 pb-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4" style={{ color: ACCENT }} />
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: ACCENT }}
            >
              FitTrack AI
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-1">
            {tab === "login" ? "Welcome Back" : "Join FitTrack"}
          </h2>
          <p className="text-xs text-white/40 tracking-wide mb-6">
            {tab === "login"
              ? "Log in to continue your journey."
              : "Create your free account and start training."}
          </p>

          {/* Custom Tabs */}
          <div
            className="flex w-full mb-6 rounded-lg overflow-hidden"
            style={{
              border: "1px solid oklch(0.22 0.04 260)",
              background: "oklch(0.14 0.02 260)",
            }}
          >
            <button
              type="button"
              data-ocid="auth.login.tab"
              onClick={() => setTab("login")}
              className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                background: tab === "login" ? ACCENT : "transparent",
                color:
                  tab === "login"
                    ? "oklch(0.08 0.005 260)"
                    : "oklch(0.55 0.05 260)",
                boxShadow: tab === "login" ? `0 0 15px ${ACCENT}40` : "none",
              }}
            >
              Login
            </button>
            <button
              type="button"
              data-ocid="auth.register.tab"
              onClick={() => setTab("register")}
              className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                background: tab === "register" ? ACCENT : "transparent",
                color:
                  tab === "register"
                    ? "oklch(0.08 0.005 260)"
                    : "oklch(0.55 0.05 260)",
                boxShadow: tab === "register" ? `0 0 15px ${ACCENT}40` : "none",
              }}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Email
                </Label>
                <Input
                  data-ocid="auth.login.email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Password
                </Label>
                <Input
                  data-ocid="auth.login.password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                data-ocid="auth.login.submit_button"
                disabled={loginLoading}
                className="mt-2 w-full py-3.5 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded"
                style={{
                  background: ACCENT,
                  color: "oklch(0.08 0.005 260)",
                  boxShadow: `0 0 25px ${ACCENT}50`,
                  opacity: loginLoading ? 0.7 : 1,
                }}
              >
                {loginLoading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {loginLoading ? "Logging in..." : "Login"}
              </button>
              <p className="text-center text-xs text-white/30 mt-1">
                No account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="underline font-medium"
                  style={{ color: ACCENT }}
                >
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Name
                </Label>
                <Input
                  data-ocid="auth.register.name"
                  placeholder="Your full name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Email
                </Label>
                <Input
                  data-ocid="auth.register.email"
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Password
                </Label>
                <Input
                  data-ocid="auth.register.password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] tracking-widest uppercase text-white/50">
                  Confirm Password
                </Label>
                <Input
                  data-ocid="auth.register.confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  style={inputStyle}
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <button
                type="submit"
                data-ocid="auth.register.submit_button"
                disabled={regLoading}
                className="mt-2 w-full py-3.5 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded"
                style={{
                  background: ACCENT,
                  color: "oklch(0.08 0.005 260)",
                  boxShadow: `0 0 25px ${ACCENT}50`,
                  opacity: regLoading ? 0.7 : 1,
                }}
              >
                {regLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {regLoading ? "Creating account..." : "Create Account"}
              </button>
              <p className="text-center text-xs text-white/30 mt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="underline font-medium"
                  style={{ color: ACCENT }}
                >
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
