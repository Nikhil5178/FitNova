import { BarChart3, Check, Crown, Heart, Scan, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { PaymentModal } from "./PaymentModal";

type Page = "dashboard" | "anatomy" | "cardio" | "strength" | "workoutBuilder";

const TRAINING_NAV = [
  {
    label: "Cardio",
    icon: Heart,
    action: () =>
      window.dispatchEvent(
        new CustomEvent("fittrack:navigate", { detail: "cardio" }),
      ),
    page: "cardio",
    color: "oklch(0.65 0.22 240)",
  },
  {
    label: "Strength",
    icon: BarChart3,
    action: () =>
      window.dispatchEvent(
        new CustomEvent("fittrack:navigate", { detail: "strength" }),
      ),
    page: "strength",
    color: "oklch(0.76 0.16 55)",
  },
  {
    label: "Anatomy",
    icon: Scan,
    action: () =>
      window.dispatchEvent(
        new CustomEvent("fittrack:navigate", { detail: "anatomy" }),
      ),
    page: "anatomy",
    color: "oklch(0.68 0.16 175)",
  },
  {
    label: "Builder",
    icon: Wrench,
    action: () =>
      window.dispatchEvent(
        new CustomEvent("fittrack:navigate", { detail: "workoutBuilder" }),
      ),
    page: "workoutBuilder",
    color: "oklch(0.65 0.22 285)",
  },
];

const PLANS = [
  {
    id: "general",
    name: "Free",
    badge: "GENERAL",
    price: "$0",
    period: "/mo",
    tagline: "Start your journey for free.",
    color: "oklch(0.55 0.01 260)",
    borderColor: "oklch(0.25 0.01 260)",
    popular: false,
    ctaLabel: "Get Started Free",
    features: [
      "Basic workout logging",
      "Nutrition tracking (7 days)",
      "3 workout templates",
      "Community access",
      "Mobile app",
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    badge: "MOST POPULAR",
    price: "$9.99",
    period: "/mo",
    tagline: "Unlock your full potential.",
    color: "oklch(0.65 0.22 240)",
    borderColor: "oklch(0.65 0.22 240 / 0.5)",
    popular: true,
    ctaLabel: "Go Premium",
    features: [
      "Unlimited workout logging",
      "Full nutrition tracking",
      "AI Coach (50 msgs/day)",
      "Advanced analytics",
      "Custom workout builder",
      "Priority support",
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    badge: "ULTIMATE",
    price: "$29.99",
    period: "/mo",
    tagline: "Built for obsession.",
    color: "oklch(0.76 0.16 55)",
    borderColor: "oklch(0.76 0.16 55 / 0.5)",
    popular: false,
    ctaLabel: "Go Elite",
    features: [
      "Everything in Premium",
      "Unlimited AI Coach",
      "Personal trainer access",
      "Custom meal plans",
      "Body scan analysis",
      "Exclusive challenges",
      "Early feature access",
    ],
  },
];

type Plan = (typeof PLANS)[number];

interface LeftSidebarProps {
  currentPage: Page;
}

export function LeftSidebar({ currentPage }: LeftSidebarProps) {
  const [plansOpen, setPlansOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  function handlePlanCta(plan: Plan) {
    if (plan.id === "general") {
      try {
        const session = localStorage.getItem("fittrack_session");
        if (session) {
          setPlansOpen(false);
          window.dispatchEvent(
            new CustomEvent("fittrack:navigate", { detail: "dashboard" }),
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch {}
      setPlansOpen(false);
      setShowAuth(true);
    } else {
      setPlansOpen(false);
      setSelectedPlan(plan);
    }
  }

  return (
    <>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex flex-col w-[220px] shrink-0 sticky top-0 h-screen border-r"
        style={{
          background: "oklch(var(--sidebar))",
          borderColor: "oklch(0.65 0.22 240 / 0.12)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 h-16 border-b"
          style={{ borderColor: "oklch(0.65 0.22 240 / 0.10)" }}
        >
          <div className="flex items-center gap-1">
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              FN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="font-sans font-bold text-xs tracking-[0.18em] uppercase text-foreground">
            FITNOVA
          </span>
        </div>

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5 px-3">
          {/* Training nav group */}
          <p
            className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 mb-2"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Training
          </p>
          {TRAINING_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                data-ocid="nav.link"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-xs font-bold tracking-[0.08em] uppercase transition-all duration-200"
                style={{
                  color: isActive ? item.color : "var(--muted-foreground)",
                  background: isActive
                    ? `${item.color.replace(")", " / 0.12)")}`
                    : "transparent",
                  borderLeft: isActive
                    ? `2px solid ${item.color}`
                    : "2px solid transparent",
                }}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isActive ? item.color : undefined }}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Separator */}
          <div
            className="my-3 mx-3 border-t"
            style={{ borderColor: "oklch(0.65 0.22 240 / 0.12)" }}
          />

          {/* Plans section label */}
          <p
            className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 mb-2"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Plans
          </p>

          {/* Membership Plans button */}
          <button
            type="button"
            onClick={() => setPlansOpen(true)}
            data-ocid="nav.open_modal_button"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-xs font-bold tracking-[0.08em] uppercase transition-all duration-200 hover:opacity-90"
            style={{
              color: "oklch(0.76 0.16 55)",
              background: "oklch(0.76 0.16 55 / 0.10)",
              borderLeft: "2px solid oklch(0.76 0.16 55 / 0.5)",
            }}
          >
            <Crown
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "oklch(0.76 0.16 55)" }}
            />
            <span>Membership Plans</span>
          </button>
        </div>

        {/* Footer hint */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "oklch(0.65 0.22 240 / 0.10)" }}
        >
          <p
            className="text-[9px] tracking-wide uppercase"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            AI-Powered Fitness
          </p>
        </div>
      </motion.aside>

      {/* Membership Plans Modal */}
      <AnimatePresence>
        {plansOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: "oklch(0 0 0 / 0.85)" }}
            onClick={(e) => e.target === e.currentTarget && setPlansOpen(false)}
            data-ocid="plans.modal"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border"
              style={{
                background: "oklch(0.08 0.01 260)",
                borderColor: "oklch(0.65 0.22 240 / 0.2)",
              }}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b sticky top-0 z-10"
                style={{
                  background: "oklch(0.08 0.01 260)",
                  borderColor: "oklch(0.65 0.22 240 / 0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Crown
                    className="w-5 h-5"
                    style={{ color: "oklch(0.76 0.16 55)" }}
                  />
                  <h2 className="font-display font-bold text-xl text-white tracking-tight">
                    Membership Plans
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPlansOpen(false)}
                  data-ocid="plans.close_button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    color: "oklch(0.55 0.01 260)",
                    background: "oklch(0.12 0.01 260)",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Plan cards */}
              <div className="p-6 flex flex-col gap-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className="rounded-xl border p-5 relative transition-all duration-300"
                    style={{
                      borderColor: plan.borderColor,
                      background: plan.popular
                        ? "oklch(0.65 0.22 240 / 0.06)"
                        : "oklch(0.10 0.01 260)",
                      boxShadow: plan.popular
                        ? "0 0 24px oklch(0.65 0.22 240 / 0.12)"
                        : "none",
                    }}
                  >
                    {/* Badge */}
                    <span
                      className="text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full absolute top-4 right-4"
                      style={{
                        color: plan.color,
                        border: `1px solid ${plan.borderColor}`,
                        background: "oklch(0.10 0.01 260)",
                      }}
                    >
                      {plan.badge}
                    </span>

                    {/* Plan name + price */}
                    <div className="mb-4">
                      <h3
                        className="font-display font-extrabold text-2xl leading-none"
                        style={{ color: plan.color }}
                      >
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-1.5">
                        <span className="text-white font-bold text-3xl">
                          {plan.price}
                        </span>
                        <span className="text-white/50 text-sm">
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="flex flex-col gap-2 mb-5">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          <Check
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: plan.color }}
                          />
                          <span className="text-white/60">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      type="button"
                      data-ocid="plans.primary_button"
                      onClick={() => handlePlanCta(plan)}
                      className="w-full py-2.5 rounded-lg text-xs font-bold tracking-[0.1em] uppercase transition-all duration-200"
                      style={{
                        background: plan.popular
                          ? "oklch(0.65 0.22 240)"
                          : "transparent",
                        color: plan.popular ? "white" : plan.color,
                        border: `1px solid ${plan.borderColor}`,
                      }}
                    >
                      {plan.ctaLabel}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      <PaymentModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
}
