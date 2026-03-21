import { type Variants, motion } from "motion/react";

const strengthItems = [
  {
    id: "bench",
    label: "BENCH PRESS",
    image: "/assets/generated/strength-bench.dim_600x400.jpg",
    desc: "Build raw chest, shoulder, and tricep power with progressive overload.",
    color: "oklch(0.65 0.22 240)",
  },
  {
    id: "squats",
    label: "SQUATS",
    image: "/assets/generated/strength-squats.dim_600x400.jpg",
    desc: "The king of all lifts. Forge iron legs, glutes, and a bulletproof core.",
    color: "oklch(0.76 0.16 55)",
  },
  {
    id: "deadlift",
    label: "DEADLIFT",
    image: "/assets/generated/strength-deadlift.dim_600x400.jpg",
    desc: "Pull everything. Build total-body strength from the ground up.",
    color: "oklch(0.68 0.16 175)",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function StrengthSection() {
  return (
    <section className="px-6 mt-16" id="strength">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-display font-bold tracking-tight text-foreground uppercase">
          Strength Training
        </h2>
        <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
          Iron your discipline. Forge your body.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {strengthItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            data-ocid={`strength.${item.id}.card`}
            className="group relative overflow-hidden rounded-xl cult-border cursor-pointer"
            style={{ aspectRatio: "16/10" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none z-10"
              style={{
                boxShadow: `inset 0 0 0 2px ${item.color}, 0 0 20px ${item.color}60`,
              }}
            />
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div
                className="text-xs font-bold tracking-[0.25em] mb-1"
                style={{ color: item.color }}
              >
                ▸ {item.label}
              </div>
              <p className="text-sm text-foreground/80 leading-snug">
                {item.desc}
              </p>
            </div>
            <div className="absolute top-4 left-4">
              <span
                className="text-[10px] font-bold tracking-[0.3em] px-2 py-1 border"
                style={{
                  color: item.color,
                  borderColor: `${item.color}60`,
                  background: "rgba(0,0,0,0.6)",
                }}
              >
                {item.label}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
