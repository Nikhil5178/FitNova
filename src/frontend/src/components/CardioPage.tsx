import { ArrowLeft, Clock, Flame, Heart, Zap } from "lucide-react";
import { type Variants, motion } from "motion/react";

const BLUE = "oklch(0.65 0.22 240)";
const AMBER = "oklch(0.76 0.16 55)";
const TEAL = "oklch(0.68 0.16 175)";

const cardioItems = [
  {
    id: "running",
    label: "Running",
    image: "/assets/generated/cardio-running.dim_600x400.jpg",
    desc: "Build endurance, burn fat, and clear your mind with steady-state and interval runs. The most accessible cardio discipline on the planet.",
    calories: "400–800",
    muscles: ["Quads", "Calves", "Glutes", "Core"],
    color: BLUE,
  },
  {
    id: "cycling",
    label: "Cycling",
    image: "/assets/generated/cardio-cycling.dim_600x400.jpg",
    desc: "Low-impact, high-output. Power your legs and torch serious calories without the joint stress of running.",
    calories: "500–900",
    muscles: ["Quads", "Hamstrings", "Calves", "Glutes"],
    color: AMBER,
  },
  {
    id: "hiit",
    label: "HIIT",
    image: "/assets/generated/cardio-hiit.dim_600x400.jpg",
    desc: "Maximum intensity in minimum time. Push your limits with alternating bursts of effort and recovery to ignite metabolism.",
    calories: "600–1000",
    muscles: ["Full Body", "Core", "Legs", "Shoulders"],
    color: TEAL,
  },
  {
    id: "rowing",
    label: "Rowing",
    image: "/assets/generated/cardio-rowing.dim_600x400.jpg",
    desc: "A total-body cardio powerhouse. Rowing engages 86% of your muscles in a rhythmic, low-impact motion that melts calories fast.",
    calories: "400–700",
    muscles: ["Back", "Core", "Legs", "Arms"],
    color: BLUE,
  },
  {
    id: "jumprope",
    label: "Jump Rope",
    image: "/assets/generated/cardio-jumprope.dim_600x400.jpg",
    desc: "Deceptively simple, brutally effective. Jump rope builds coordination, agility, and cardio capacity with zero equipment cost.",
    calories: "700–1000",
    muscles: ["Calves", "Shoulders", "Core", "Wrists"],
    color: AMBER,
  },
  {
    id: "swimming",
    label: "Swimming",
    image: "/assets/generated/cardio-swimming.dim_600x400.jpg",
    desc: "The ultimate full-body cardio. Swimming is zero-impact, meditative, and builds lung capacity unlike anything else.",
    calories: "500–800",
    muscles: ["Shoulders", "Back", "Core", "Legs"],
    color: TEAL,
  },
];

const programs = [
  {
    id: "fat-burn",
    name: "Beginner Fat Burn",
    duration: "4 Weeks",
    frequency: "3x / week",
    sessions: "20–30 min sessions",
    level: "BEGINNER",
    levelColor: "oklch(0.72 0.18 145)",
    desc: "Perfect for those just starting out. Steady-state cardio with gentle progressions to build the aerobic base safely.",
    exercises: ["30-min walk/jog", "Bike intervals", "Low-impact HIIT"],
  },
  {
    id: "endurance",
    name: "Endurance Builder",
    duration: "8 Weeks",
    frequency: "4x / week",
    sessions: "30–60 min sessions",
    level: "INTERMEDIATE",
    levelColor: BLUE,
    desc: "Push your VO2 max with structured progression. Mix of tempo runs, long steady-state sessions, and moderate HIIT.",
    exercises: [
      "Tempo runs",
      "Long slow distance",
      "Cycling intervals",
      "Rowing sprints",
    ],
  },
  {
    id: "hiit-power",
    name: "HIIT Power Protocol",
    duration: "6 Weeks",
    frequency: "5x / week",
    sessions: "20–45 min sessions",
    level: "ADVANCED",
    levelColor: AMBER,
    desc: "High-intensity every session. Designed to shred body fat, maximize afterburn effect, and peak athletic conditioning.",
    exercises: [
      "Tabata sprints",
      "Jump rope circuits",
      "Assault bike intervals",
      "Plyometric HIIT",
    ],
  },
];

const tips = [
  {
    icon: Heart,
    title: "Warm Up Properly",
    body: "Always spend 5–10 minutes warming up with light movement and dynamic stretching. Cold muscles are injury-prone muscles.",
    color: TEAL,
  },
  {
    icon: Zap,
    title: "Track Heart Rate",
    body: "Stay in your target heart rate zone (50–85% of max HR). Use the formula: 220 – age = max HR. Zone 2 (60–70%) burns the most fat.",
    color: BLUE,
  },
  {
    icon: Flame,
    title: "Progressive Overload",
    body: "Add 10% distance or intensity each week. Your heart and lungs adapt just like muscles — they need progressive challenge to grow stronger.",
    color: AMBER,
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
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

export function CardioPage() {
  function goBack() {
    window.dispatchEvent(
      new CustomEvent("fittrack:navigate", { detail: "dashboard" }),
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        <motion.button
          type="button"
          onClick={goBack}
          data-ocid="cardio.back_button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="tracking-[0.12em] uppercase text-xs font-medium">
            Dashboard
          </span>
        </motion.button>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6">
        {/* Blobs */}
        <div
          className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: BLUE }}
        />
        <div
          className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: TEAL }}
        />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="text-xs font-bold tracking-[0.4em] uppercase mb-4"
              style={{ color: BLUE }}
            >
              ▸ TRAINING DISCIPLINE
            </div>
            <h1 className="font-display font-bold text-6xl md:text-8xl text-foreground tracking-tight uppercase leading-none mb-4">
              CARDIO
              <br />
              <span style={{ color: BLUE }}>TRAINING</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mt-6 leading-relaxed">
              Fuel your endurance. Ignite your potential. Six disciplines — from
              steady-state to explosive intervals — to forge your cardiovascular
              engine.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Disciplines Grid */}
      <section className="max-w-[1400px] mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">
            Disciplines
          </h2>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Choose your weapon
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {cardioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              data-ocid={`cardio.${item.id}.card`}
              className="group cult-border rounded-xl overflow-hidden cursor-pointer bg-card"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              {/* Image */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 2px ${item.color}` }}
                />
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.3em] px-2 py-1 border"
                  style={{
                    color: item.color,
                    borderColor: `${item.color}60`,
                    background: "rgba(0,0,0,0.7)",
                  }}
                >
                  {item.label.toUpperCase()}
                </span>
              </div>
              {/* Info */}
              <div className="p-5">
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Flame
                      className="w-3.5 h-3.5"
                      style={{ color: item.color }}
                    />
                    <span className="text-xs text-muted-foreground tracking-wide">
                      <span className="font-bold" style={{ color: item.color }}>
                        {item.calories}
                      </span>{" "}
                      cal/hr
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.muscles.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full border"
                      style={{
                        color: item.color,
                        borderColor: `${item.color}40`,
                        background: `${item.color}10`,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Programs */}
      <section className="max-w-[1400px] mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">
            Cardio Programs
          </h2>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Structured plans for every level
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {programs.map((prog) => (
            <motion.div
              key={prog.id}
              variants={itemVariants}
              data-ocid={`cardio.${prog.id}.card`}
              className="group cult-border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-[10px] font-bold tracking-[0.3em] px-2.5 py-1 rounded-full border"
                  style={{
                    color: prog.levelColor,
                    borderColor: `${prog.levelColor}60`,
                    background: `${prog.levelColor}15`,
                  }}
                >
                  {prog.level}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-2 tracking-tight">
                {prog.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {prog.desc}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: Clock, label: prog.duration },
                  { icon: Zap, label: prog.frequency },
                  { icon: Flame, label: prog.sessions },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg"
                    style={{ background: `${prog.levelColor}10` }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: prog.levelColor }}
                    />
                    <span className="text-[10px] text-center text-foreground/60 leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {prog.exercises.map((ex) => (
                  <div
                    key={ex}
                    className="flex items-center gap-2 text-xs text-foreground/60"
                  >
                    <span style={{ color: prog.levelColor }}>▸</span>
                    {ex}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tips */}
      <section className="max-w-[1400px] mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">
            Pro Tips
          </h2>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Train smarter, not just harder
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {tips.map((tip) => (
            <motion.div
              key={tip.title}
              variants={itemVariants}
              className="cult-border rounded-xl p-6 bg-card"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${tip.color}20`,
                  border: `1px solid ${tip.color}40`,
                }}
              >
                <tip.icon className="w-5 h-5" style={{ color: tip.color }} />
              </div>
              <h3 className="font-display font-bold text-base text-foreground mb-2 tracking-tight">
                {tip.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
