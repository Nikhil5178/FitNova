import { type Variants, motion } from "motion/react";

const cardioItems = [
  {
    id: "running",
    label: "RUNNING",
    image: "/assets/generated/cardio-running.dim_600x400.jpg",
    desc: "Build endurance & burn fat with steady-state and interval runs.",
    color: "oklch(0.65 0.22 240)",
  },
  {
    id: "cycling",
    label: "CYCLING",
    image: "/assets/generated/cardio-cycling.dim_600x400.jpg",
    desc: "Low-impact, high-output. Power your legs and torch calories.",
    color: "oklch(0.76 0.16 55)",
  },
  {
    id: "hiit",
    label: "HIIT",
    image: "/assets/generated/cardio-hiit.dim_600x400.jpg",
    desc: "Maximum intensity in minimum time. Push limits, ignite metabolism.",
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

export function CardioSection() {
  return (
    <section className="px-6 mt-16" id="cardio">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-display font-bold tracking-tight text-foreground uppercase">
          Cardio Training
        </h2>
        <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
          Choose your discipline. Own your pace.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {cardioItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            data-ocid={`cardio.${item.id}.card`}
            className="group relative overflow-hidden rounded-xl cult-border cursor-pointer"
            style={{ aspectRatio: "16/10" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25 }}
          >
            {/* Glow border on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none z-10"
              style={{
                boxShadow: `inset 0 0 0 2px ${item.color}, 0 0 20px ${item.color}60`,
              }}
            />

            {/* Image */}
            <img
              src={item.image}
              alt={item.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content overlay */}
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

            {/* Top label */}
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
