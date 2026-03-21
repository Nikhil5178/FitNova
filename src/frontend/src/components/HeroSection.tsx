import { type Variants, motion } from "motion/react";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const TICKER_ITEMS = [
  "TRACK EVERY REP",
  "TRAIN HARDER",
  "TRANSFORM YOUR BODY",
  "FUEL YOUR BODY",
  "BECOME ELITE",
  "NO DAYS OFF",
];

const tickerText = Array(4)
  .fill(TICKER_ITEMS)
  .flat()
  .map((t, i) => ({ text: t, key: i }));

export function HeroSection() {
  return (
    <section className="relative overflow-hidden mx-4 mt-4 rounded-none lg:rounded-3xl">
      {/* Animated gradient blobs */}
      <div
        className="absolute top-[-80px] left-[-60px] w-[500px] h-[500px] pointer-events-none animate-blob"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 240 / 0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-[20%] right-[-100px] w-[400px] h-[400px] pointer-events-none animate-blob-slow"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.18 160 / 0.18) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-[-40px] left-[40%] w-[350px] h-[350px] pointer-events-none animate-blob-slower"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.2 280 / 0.16) 0%, transparent 70%)",
          filter: "blur(65px)",
        }}
      />

      {/* Border */}
      <div className="absolute inset-0 rounded-[inherit] border border-border pointer-events-none z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-20 px-6 md:px-12 lg:px-16 pt-14 pb-0"
      >
        {/* Top row labels */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between mb-8"
        >
          <span className="data-label">EST. 2024 · ELITE FITNESS PLATFORM</span>
          <span className="flex items-center gap-1.5 data-label">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring inline-block" />
            LIVE TRACKING
          </span>
        </motion.div>

        {/* Mega headline */}
        <div className="overflow-hidden">
          <motion.h1
            variants={itemVariants}
            className="leading-[0.9] tracking-tight select-none"
          >
            <span className="block font-display font-extrabold text-foreground text-[clamp(3.5rem,12vw,13rem)]">
              TRACK.
            </span>
            <span
              className="block font-display font-extrabold text-[clamp(3.5rem,12vw,13rem)]"
              style={{
                WebkitTextStroke: "1.5px oklch(var(--foreground))",
                color: "transparent",
              }}
            >
              TRAIN.
            </span>
            <span className="block font-display font-extrabold text-primary text-glow text-[clamp(3.5rem,12vw,13rem)]">
              TRANSFORM.
            </span>
          </motion.h1>
        </div>

        {/* Manifesto line */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4"
        >
          <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">
            Your AI-powered fitness companion for real results.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-0">
            {[
              { value: "4-Day", label: "Streak 🔥" },
              { value: "87%", label: "Weekly Goal" },
              { value: "420 kcal", label: "Today" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`px-6 py-3 ${
                  i !== 0 ? "border-l border-border" : ""
                }`}
              >
                <div className="text-foreground font-bold text-lg leading-none">
                  {stat.value}
                </div>
                <div className="data-label mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee ticker */}
      <div className="relative z-20 mt-6 border-t border-border overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {tickerText.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-3 mx-3 text-foreground/40 tracking-[0.2em] uppercase text-xs font-medium"
            >
              {item.text}
              <span className="w-1 h-1 rounded-full bg-primary inline-block flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
