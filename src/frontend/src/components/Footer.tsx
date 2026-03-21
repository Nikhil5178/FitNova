import { motion } from "motion/react";
import { SiGithub, SiInstagram, SiX } from "react-icons/si";

const SOCIAL_LINKS = [
  { icon: <SiGithub className="w-3.5 h-3.5" />, href: "#", label: "GitHub" },
  { icon: <SiX className="w-3.5 h-3.5" />, href: "#", label: "X" },
  {
    icon: <SiInstagram className="w-3.5 h-3.5" />,
    href: "#",
    label: "Instagram",
  },
];

function dispatch(page: string) {
  window.dispatchEvent(new CustomEvent("fittrack:navigate", { detail: page }));
}

function goToDashboardAndScroll(anchor: string) {
  dispatch("dashboard");
  setTimeout(() => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 150);
}

const NAV_ITEMS: { label: string; action: () => void }[] = [
  { label: "Dashboard", action: () => dispatch("dashboard") },
  { label: "Workouts", action: () => goToDashboardAndScroll("workouts") },
  { label: "Nutrition", action: () => goToDashboardAndScroll("nutrition") },
  {
    label: "AI Coach",
    action: () => window.dispatchEvent(new CustomEvent("fittrack:open_coach")),
  },
  { label: "Goals", action: () => goToDashboardAndScroll("goals") },
  { label: "Cardio", action: () => dispatch("cardio") },
  { label: "Strength", action: () => dispatch("strength") },
  { label: "Anatomy", action: () => dispatch("anatomy") },
  { label: "Builder", action: () => dispatch("workoutBuilder") },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-24"
    >
      {/* Brand seal */}
      <div className="flex items-center gap-4 px-6 mb-0">
        <div className="flex-1 h-px bg-white/6" />
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-sm text-foreground">
            FN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-sans font-bold text-xs tracking-[0.25em] uppercase text-muted-foreground">
            FITNOVA
          </span>
        </div>
        <div className="flex-1 h-px bg-white/6" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <p className="data-label mb-3">About</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Built for those who never stop. Your AI-powered fitness companion
              for smarter workouts, better nutrition, and real results.
            </p>
            <p className="text-primary text-lg mt-4 font-bold tracking-wide">
              Track. Train. Transform.
            </p>
          </div>

          <div>
            <p className="data-label mb-3">Navigate</p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={item.action}
                    data-ocid="nav.link"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-[0.12em] uppercase cursor-pointer bg-transparent border-0 p-0"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="data-label mb-3">Connect</p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 border border-white/8 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 pt-6 flex items-center justify-center">
          <p className="data-label">
            © {year} FitNova AI · All rights reserved
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
