import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Bell,
  CheckCheck,
  Dumbbell,
  Flame,
  Menu,
  Moon,
  Salad,
  Sun,
  Target,
  Trophy,
  User,
  Weight,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AuthModal } from "./AuthModal";

// Section links: scroll-to anchors on the dashboard page
const NAV_LINKS = [
  { label: "Dashboard", anchor: "dashboard" },
  { label: "Workouts", anchor: "workouts" },
  { label: "Nutrition", anchor: "nutrition" },
  { label: "Activity", anchor: "activity" },
  { label: "Goals", anchor: "goals" },
];

const ACCENT = "oklch(0.65 0.22 240)";

interface UserSession {
  name: string;
  email: string;
}

interface FitProfile {
  name?: string;
  email?: string;
  fitnessGoal?: string;
  fitnessLevel?: string;
  equipment?: string;
}

interface Notification {
  id: string;
  icon: React.ReactNode;
  message: string;
  time: string;
  unread: boolean;
}

function getSession(): UserSession | null {
  try {
    const raw = localStorage.getItem("fittrack_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getProfile(): FitProfile {
  try {
    const raw = localStorage.getItem("fittrack_profile");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function initTheme() {
  try {
    const saved = localStorage.getItem("fittrack_theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    return saved === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function buildNotifications(): Notification[] {
  const notes: Notification[] = [];

  try {
    const workouts: { name?: string; type?: string }[] = JSON.parse(
      localStorage.getItem("fittrack_workouts") || "[]",
    );
    workouts
      .slice(-3)
      .reverse()
      .forEach((w, i) => {
        notes.push({
          id: `workout-${i}`,
          icon: <Dumbbell className="w-3.5 h-3.5" />,
          message: `You logged a workout: ${w.name || w.type || "Session"}`,
          time: "recently",
          unread: true,
        });
      });
  } catch {}

  try {
    const meals: { name?: string; food?: string }[] = JSON.parse(
      localStorage.getItem("fittrack_meals") || "[]",
    );
    meals
      .slice(-2)
      .reverse()
      .forEach((m, i) => {
        notes.push({
          id: `meal-${i}`,
          icon: <Salad className="w-3.5 h-3.5" />,
          message: `Meal logged: ${m.name || m.food || "Meal"}`,
          time: "recently",
          unread: true,
        });
      });
  } catch {}

  try {
    const goals: { name?: string; title?: string }[] = JSON.parse(
      localStorage.getItem("fittrack_goals") || "[]",
    );
    goals
      .slice(-2)
      .reverse()
      .forEach((g, i) => {
        notes.push({
          id: `goal-${i}`,
          icon: <Target className="w-3.5 h-3.5" />,
          message: `Goal set: ${g.name || g.title || "New Goal"}`,
          time: "recently",
          unread: true,
        });
      });
  } catch {}

  try {
    const challengeAccepted = localStorage.getItem(
      "fittrack_challenge_accepted",
    );
    if (challengeAccepted) {
      notes.push({
        id: "challenge",
        icon: <Trophy className="w-3.5 h-3.5" />,
        message: "Challenge of the Week accepted!",
        time: "recently",
        unread: true,
      });
    }
  } catch {}

  try {
    const weights: { weight?: number }[] = JSON.parse(
      localStorage.getItem("fittrack_weight_entries") || "[]",
    );
    if (weights.length > 0) {
      notes.push({
        id: "weight",
        icon: <Weight className="w-3.5 h-3.5" />,
        message: "Body weight logged",
        time: "recently",
        unread: true,
      });
    }
  } catch {}

  return notes.slice(0, 6);
}

/** Navigate to dashboard, then (after a tick) scroll to anchor */
function goToDashboardAndScroll(anchor: string) {
  const scroll = () => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  window.dispatchEvent(
    new CustomEvent("fittrack:navigate", { detail: "dashboard" }),
  );
  setTimeout(scroll, 150);
}

// ─── Profile Modal ───────────────────────────────────────────────────────────
function ProfileModal({
  open,
  onClose,
  session,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  session: UserSession | null;
  onSave: (name: string) => void;
}) {
  const profile = getProfile();
  const [name, setName] = useState(session?.name || "");
  const [fitnessGoal, setFitnessGoal] = useState(profile.fitnessGoal || "");
  const [fitnessLevel, setFitnessLevel] = useState(profile.fitnessLevel || "");
  const [equipment, setEquipment] = useState(profile.equipment || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      const p = getProfile();
      const s = getSession();
      setName(s?.name || "");
      setFitnessGoal(p.fitnessGoal || "");
      setFitnessLevel(p.fitnessLevel || "");
      setEquipment(p.equipment || "");
      setSaved(false);
    }
  }, [open]);

  function handleSave() {
    const session = getSession();
    if (session) {
      const updated = { ...session, name };
      localStorage.setItem("fittrack_session", JSON.stringify(updated));
    }
    const existingProfile = getProfile();
    const updatedProfile: FitProfile = {
      ...existingProfile,
      name,
      fitnessGoal,
      fitnessLevel,
      equipment,
    };
    localStorage.setItem("fittrack_profile", JSON.stringify(updatedProfile));
    setSaved(true);
    onSave(name);
    setTimeout(() => {
      onClose();
      setSaved(false);
    }, 800);
  }

  const inputStyle = {
    background: "oklch(0.12 0.01 260)",
    border: "1px solid oklch(0.65 0.22 240 / 0.3)",
    color: "var(--foreground)",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md border"
        style={{
          background: "oklch(0.1 0.01 260)",
          borderColor: `${ACCENT}50`,
          boxShadow: `0 0 40px ${ACCENT}20`,
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-display">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: `${ACCENT}20`, color: ACCENT }}
            >
              <User className="w-4 h-4" />
            </span>
            <span style={{ color: "var(--foreground)" }}>Your Profile</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div
            className="flex items-center gap-3 p-3 rounded-lg"
            style={{ background: "oklch(0.13 0.01 260)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: `${ACCENT}20`, color: ACCENT }}
            >
              {name
                ? name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "FN"}
            </div>
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--foreground)" }}
              >
                {name || "Your Name"}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                {session?.email || ""}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Label
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              Display Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
              data-ocid="profile.input"
            />
          </div>

          <div className="space-y-1">
            <Label
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              Fitness Goal
            </Label>
            <Input
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
              placeholder="e.g. Lose weight, Build muscle"
              style={inputStyle}
              data-ocid="profile.input"
            />
          </div>

          <div className="space-y-1">
            <Label
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              Fitness Level
            </Label>
            <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
              <SelectTrigger style={inputStyle} data-ocid="profile.select">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: "oklch(0.12 0.01 260)",
                  borderColor: `${ACCENT}40`,
                }}
              >
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              Equipment
            </Label>
            <Select value={equipment} onValueChange={setEquipment}>
              <SelectTrigger style={inputStyle} data-ocid="profile.select">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: "oklch(0.12 0.01 260)",
                  borderColor: `${ACCENT}40`,
                }}
              >
                <SelectItem value="None">No Equipment</SelectItem>
                <SelectItem value="Dumbbells">Dumbbells</SelectItem>
                <SelectItem value="Barbell">Barbell & Rack</SelectItem>
                <SelectItem value="Full Gym">Full Gym Access</SelectItem>
                <SelectItem value="Resistance Bands">
                  Resistance Bands
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full font-bold tracking-widest uppercase text-xs h-10"
            style={{
              background: saved ? "oklch(0.6 0.18 145)" : ACCENT,
              color: "oklch(0.08 0.005 260)",
              boxShadow: `0 0 20px ${ACCENT}30`,
            }}
            onClick={handleSave}
            data-ocid="profile.save_button"
          >
            {saved ? "✓ Saved!" : "Save Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Notifications Panel ─────────────────────────────────────────────────────
function NotificationsPanel({
  notifications,
  onClose,
}: {
  notifications: Notification[];
  onClose: () => void;
}) {
  const [read, setRead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-12 right-0 z-50 w-80 rounded-xl border overflow-hidden"
      style={{
        background: "oklch(0.1 0.01 260)",
        borderColor: `${ACCENT}40`,
        boxShadow: `0 16px 48px oklch(0 0 0 / 0.6), 0 0 0 1px ${ACCENT}20`,
      }}
      data-ocid="notifications.popover"
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "oklch(0.65 0.22 240 / 0.15)" }}
      >
        <span
          className="text-xs font-bold tracking-[0.15em] uppercase"
          style={{ color: "var(--foreground)" }}
        >
          Notifications
        </span>
        <button
          type="button"
          onClick={() => setRead(true)}
          className="flex items-center gap-1 text-[10px] tracking-wide transition-colors"
          style={{ color: read ? "oklch(0.6 0.18 145)" : ACCENT }}
          data-ocid="notifications.button"
        >
          <CheckCheck className="w-3 h-3" />
          Mark all read
        </button>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div
            className="px-4 py-8 text-center"
            data-ocid="notifications.empty_state"
          >
            <Activity
              className="w-8 h-8 mx-auto mb-2 opacity-30"
              style={{ color: ACCENT }}
            />
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              No new notifications
            </p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-white/5 transition-colors"
              style={{ borderColor: "oklch(0.65 0.22 240 / 0.08)" }}
              data-ocid={`notifications.item.${i + 1}`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${ACCENT}15`, color: ACCENT }}
              >
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs leading-snug"
                  style={{
                    color: read
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                  }}
                >
                  {n.message}
                </p>
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {n.time}
                </p>
              </div>
              {n.unread && !read && (
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: ACCENT }}
                />
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [session, setSession] = useState<UserSession | null>(getSession);
  const [theme, setTheme] = useState<"dark" | "light">(
    initTheme as () => "dark" | "light",
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(buildNotifications());
  }, []);

  useEffect(() => {
    if (showNotifications) {
      setNotifications(buildNotifications());
    }
  }, [showNotifications]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleOpenAuth() {
      setShowAuth(true);
    }
    window.addEventListener("fittrack:open_auth", handleOpenAuth);
    return () =>
      window.removeEventListener("fittrack:open_auth", handleOpenAuth);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("fittrack_theme", next);
    if (next === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }

  function handleLogout() {
    localStorage.removeItem("fittrack_session");
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key?.startsWith("fittrack_") &&
        key !== "fittrack_theme" &&
        key !== "fittrack_onboarding_done" &&
        key !== "fittrack_users"
      ) {
        keysToRemove.push(key);
      }
    }
    for (const k of keysToRemove) localStorage.removeItem(k);
    setSession(null);
    window.location.reload();
  }

  function openAICoach() {
    window.dispatchEvent(new CustomEvent("fittrack:open_coach"));
    setMobileOpen(false);
  }

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FN";

  const badgeCount = notifications.length;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("fittrack:navigate", { detail: "dashboard" }),
              )
            }
            className="flex items-center gap-2.5"
            data-ocid="nav.link"
          >
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-xl text-foreground tracking-tight">
                FN
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring" />
            </div>
            <span className="font-sans font-bold text-sm tracking-[0.18em] uppercase text-foreground">
              FITNOVA
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                data-ocid="nav.link"
                onClick={() => {
                  goToDashboardAndScroll(link.anchor);
                  setMobileOpen(false);
                }}
                className="relative px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.12em] uppercase font-medium"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              data-ocid="nav.link"
              onClick={openAICoach}
              className="relative px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.12em] uppercase font-medium"
            >
              AI Coach
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse-ring" />
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.toggle"
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((v) => !v)}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="nav.toggle"
              >
                <Bell className="w-4 h-4" />
                {badgeCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 text-[9px] flex items-center justify-center bg-primary border-0 text-primary-foreground">
                    {badgeCount}
                  </Badge>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <NotificationsPanel
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {session ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-muted-foreground tracking-wide uppercase">
                  {session.name}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar
                      className="w-8 h-8 cursor-pointer border"
                      style={{ borderColor: `${ACCENT}60` }}
                      data-ocid="nav.toggle"
                    >
                      <AvatarFallback
                        className="text-xs font-bold"
                        style={{ background: `${ACCENT}20`, color: ACCENT }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44 border"
                    style={{
                      background: "oklch(0.1 0.01 260)",
                      borderColor: `${ACCENT}40`,
                      boxShadow: "0 8px 32px oklch(0 0 0 / 0.5)",
                    }}
                  >
                    <DropdownMenuItem
                      onClick={() => setShowProfile(true)}
                      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/5"
                      style={{ color: "var(--foreground)" }}
                      data-ocid="nav.open_modal_button"
                    >
                      <User className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowProfile(true)}
                      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/5"
                      style={{ color: "var(--foreground)" }}
                      data-ocid="nav.open_modal_button"
                    >
                      <Flame
                        className="w-3.5 h-3.5"
                        style={{ color: ACCENT }}
                      />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-xs cursor-pointer"
                      style={{ color: "oklch(0.65 0.22 25)" }}
                      data-ocid="nav.delete_button"
                    >
                      <X className="w-3.5 h-3.5" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuth(true)}
                data-ocid="nav.primary_button"
                className="text-xs font-bold tracking-[0.12em] uppercase h-8 px-5 rounded transition-all duration-300"
                style={{
                  background: ACCENT,
                  color: "oklch(0.08 0.005 260)",
                  boxShadow: `0 0 20px ${ACCENT}40`,
                }}
              >
                Sign In
              </button>
            )}

            <button
              type="button"
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-0.5"
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  data-ocid="nav.link"
                  onClick={() => {
                    goToDashboardAndScroll(link.anchor);
                    setMobileOpen(false);
                  }}
                  className="py-3 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.15em] uppercase font-medium border-b border-border last:border-0 text-left"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                data-ocid="nav.link"
                onClick={openAICoach}
                className="py-3 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.15em] uppercase font-medium border-b border-border text-left"
              >
                AI Coach
              </button>
              {session ? (
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowProfile(true);
                    }}
                    className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase rounded border"
                    style={{ borderColor: `${ACCENT}50`, color: ACCENT }}
                    data-ocid="nav.open_modal_button"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase rounded"
                    style={{
                      background: "oklch(0.65 0.22 25 / 0.15)",
                      color: "oklch(0.65 0.22 25)",
                    }}
                    data-ocid="nav.delete_button"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setShowAuth(true);
                  }}
                  className="mt-3 w-full py-3 text-xs font-bold tracking-[0.2em] uppercase rounded"
                  style={{ background: ACCENT, color: "oklch(0.08 0.005 260)" }}
                >
                  Sign In / Create Account
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />

      <ProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        session={session}
        onSave={(newName) => {
          setSession((prev) => (prev ? { ...prev, name: newName } : prev));
        }}
      />
    </>
  );
}
