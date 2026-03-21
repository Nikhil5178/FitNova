import { Check } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { PaymentModal } from "./PaymentModal";

const tiers = [
  {
    id: "general",
    name: "GENERAL",
    price: "Free",
    period: "",
    tagline: "Start your journey.",
    color: "oklch(0.55 0.12 240)",
    borderColor: "oklch(0.55 0.12 240 / 0.4)",
    featured: false,
    badge: null,
    features: [
      "Basic workout logging",
      "Nutrition tracking",
      "7-day history",
      "Dashboard overview",
    ],
    cta: "GET STARTED",
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "$9.99",
    period: "/mo",
    tagline: "Unlock your full potential.",
    color: "oklch(0.65 0.22 240)",
    borderColor: "oklch(0.65 0.22 240)",
    featured: true,
    badge: "MOST POPULAR",
    features: [
      "Everything in General",
      "AI Coach chatbot",
      "Goal tracking",
      "30-day history",
      "Progress charts",
      "Priority support",
    ],
    cta: "GO PREMIUM",
  },
  {
    id: "elite",
    name: "ELITE",
    price: "$29.99",
    period: "/mo",
    tagline: "Built for obsession.",
    color: "oklch(0.76 0.16 55)",
    borderColor: "oklch(0.76 0.16 55 / 0.7)",
    featured: false,
    badge: null,
    features: [
      "Everything in Premium",
      "Personal program builder",
      "Priority AI support",
      "Unlimited history",
      "Advanced analytics",
      "Exclusive elite content",
    ],
    cta: "GO ELITE",
  },
];

type Tier = (typeof tiers)[number];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function PricingSection() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Tier | null>(null);

  function handleCtaClick(tier: Tier) {
    if (tier.id === "general") {
      try {
        const session = localStorage.getItem("fittrack_session");
        if (session) {
          window.dispatchEvent(
            new CustomEvent("fittrack:navigate", { detail: "dashboard" }),
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch {}
      setShowAuthModal(true);
    } else {
      setSelectedPlan(tier);
    }
  }

  return (
    <section className="px-6 mt-20 mb-16" id="pricing">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-display font-bold tracking-tight text-foreground uppercase">
          Choose Your Plan
        </h2>
        <p className="text-sm text-muted-foreground mt-2 tracking-widest uppercase">
          No excuses. Just results.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            variants={itemVariants}
            data-ocid={`pricing.${tier.id}.card`}
            className="relative flex flex-col rounded-xl bg-card p-7 transition-all duration-300"
            style={{
              border: `1px solid ${tier.borderColor}`,
              boxShadow: tier.featured
                ? `0 0 30px ${tier.color}40, 0 0 60px ${tier.color}20`
                : "none",
              transform: tier.featured ? "scale(1.03)" : "scale(1)",
            }}
            whileHover={{
              boxShadow: `0 0 30px ${tier.color}50, 0 0 60px ${tier.color}25`,
            }}
          >
            {/* Badge */}
            {tier.badge && (
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.25em] px-3 py-1"
                style={{
                  background: tier.color,
                  color: "oklch(0.08 0.005 260)",
                }}
              >
                {tier.badge}
              </div>
            )}

            {/* Tier name */}
            <div
              className="text-xs font-bold tracking-[0.3em] mb-4"
              style={{ color: tier.color }}
            >
              {tier.name}
            </div>

            {/* Price */}
            <div className="mb-1">
              <span className="text-5xl font-display font-bold text-foreground">
                {tier.price}
              </span>
              {tier.period && (
                <span className="text-sm text-muted-foreground ml-1">
                  {tier.period}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground tracking-wide mb-6">
              {tier.tagline}
            </p>

            {/* Divider */}
            <div
              className="h-px mb-6 w-full"
              style={{ background: `${tier.color}40` }}
            />

            {/* Features */}
            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-foreground/80"
                >
                  <Check
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: tier.color }}
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              type="button"
              data-ocid={`pricing.${tier.id}.primary_button`}
              onClick={() => handleCtaClick(tier)}
              className="w-full py-3 text-xs font-bold tracking-[0.25em] transition-all duration-300 uppercase"
              style={{
                background: tier.featured ? tier.color : "transparent",
                border: `1px solid ${tier.color}`,
                color: tier.featured ? "oklch(0.08 0.005 260)" : tier.color,
              }}
              onMouseEnter={(e) => {
                if (!tier.featured) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    tier.color;
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.08 0.005 260)";
                }
              }}
              onMouseLeave={(e) => {
                if (!tier.featured) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    tier.color;
                }
              }}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </motion.div>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PaymentModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </section>
  );
}
