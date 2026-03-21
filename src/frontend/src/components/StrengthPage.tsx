import { ArrowLeft, Clock, Dumbbell, Target, Zap } from "lucide-react";
import { type Variants, motion } from "motion/react";

const BLUE = "oklch(0.65 0.22 240)";
const AMBER = "oklch(0.76 0.16 55)";
const TEAL = "oklch(0.68 0.16 175)";

const strengthItems = [
  {
    id: "bench",
    label: "Bench Press",
    image: "/assets/generated/strength-bench.dim_600x400.jpg",
    desc: "The king of chest movements. Build raw pressing power with progressive overload on the barbell bench press.",
    muscles: ["Chest", "Triceps", "Shoulders"],
    difficulty: "BEGINNER FRIENDLY",
    diffColor: "oklch(0.72 0.18 145)",
    color: BLUE,
  },
  {
    id: "squats",
    label: "Squats",
    image: "/assets/generated/strength-squats.dim_600x400.jpg",
    desc: "The king of all lifts. Forge iron legs, powerful glutes, and a bulletproof core with the barbell squat.",
    muscles: ["Quads", "Glutes", "Hamstrings", "Core"],
    difficulty: "INTERMEDIATE",
    diffColor: BLUE,
    color: AMBER,
  },
  {
    id: "deadlift",
    label: "Deadlift",
    image: "/assets/generated/strength-deadlift.dim_600x400.jpg",
    desc: "Pull everything. The deadlift builds total-body strength from the ground up — back, legs, grip, and mind.",
    muscles: ["Back", "Hamstrings", "Glutes", "Traps"],
    difficulty: "ADVANCED",
    diffColor: AMBER,
    color: TEAL,
  },
  {
    id: "pullups",
    label: "Pull-Ups",
    image: "/assets/generated/strength-pullups.dim_600x400.jpg",
    desc: "Master your own bodyweight. Pull-ups build elite lat width, bicep strength, and upper back thickness.",
    muscles: ["Lats", "Biceps", "Rear Delts", "Core"],
    difficulty: "INTERMEDIATE",
    diffColor: BLUE,
    color: BLUE,
  },
  {
    id: "ohpress",
    label: "Overhead Press",
    image: "/assets/generated/strength-ohpress.dim_600x400.jpg",
    desc: "Forge cannonball shoulders and a stable overhead. The OHP builds pressing strength no other exercise can replicate.",
    muscles: ["Shoulders", "Triceps", "Upper Chest", "Core"],
    difficulty: "INTERMEDIATE",
    diffColor: BLUE,
    color: AMBER,
  },
  {
    id: "barbellrow",
    label: "Barbell Row",
    image: "/assets/generated/strength-barbellrow.dim_600x400.jpg",
    desc: "Build a thick, powerful back. The barbell row pairs perfectly with bench press to create balanced upper-body strength.",
    muscles: ["Upper Back", "Lats", "Biceps", "Rear Delts"],
    difficulty: "INTERMEDIATE",
    diffColor: BLUE,
    color: TEAL,
  },
];

const programs = [
  {
    id: "starting-strength",
    name: "Starting Strength",
    duration: "12 Weeks",
    frequency: "3x / week",
    goal: "Build base strength",
    level: "BEGINNER",
    levelColor: "oklch(0.72 0.18 145)",
    desc: "Compound-focused beginner program. Squat, bench, deadlift, and press every session. Add weight every single workout.",
    lifts: [
      "Squat 3×5",
      "Bench Press 3×5",
      "Deadlift 1×5",
      "Overhead Press 3×5",
    ],
  },
  {
    id: "hypertrophy-mass",
    name: "Hypertrophy Mass",
    duration: "16 Weeks",
    frequency: "4x / week",
    goal: "Maximum muscle growth",
    level: "INTERMEDIATE",
    levelColor: BLUE,
    desc: "Upper/lower split with high volume and moderate intensity. Designed to pack on lean mass with controlled progressive overload.",
    lifts: [
      "Upper A / Lower A",
      "Upper B / Lower B",
      "4×8–12 rep ranges",
      "Accessory isolation work",
    ],
  },
  {
    id: "powerlifting-peak",
    name: "Powerlifting Peak",
    duration: "20 Weeks",
    frequency: "5x / week",
    goal: "Peak competition strength",
    level: "ADVANCED",
    levelColor: AMBER,
    desc: "Periodized peaking program with heavy triples, doubles, and singles. Built for competitive powerlifters chasing PRs on squat, bench, and deadlift.",
    lifts: [
      "Competition SBD",
      "Conjugate method",
      "Heavy singles 95–100%",
      "Deload weeks included",
    ],
  },
];

const muscleGroups = [
  { name: "Chest", exercises: "Bench Press, Dips, Flyes", color: BLUE },
  { name: "Back", exercises: "Deadlift, Barbell Row, Pull-Ups", color: TEAL },
  {
    name: "Shoulders",
    exercises: "Overhead Press, Lateral Raises",
    color: AMBER,
  },
  { name: "Arms", exercises: "Barbell Curl, Tricep Extension", color: BLUE },
  { name: "Core", exercises: "Plank, Hollow Body, Ab Wheel", color: TEAL },
  { name: "Legs", exercises: "Squats, Deadlift, Leg Press, RDL", color: AMBER },
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

export function StrengthPage() {
  function goBack() {
    window.dispatchEvent(
      new CustomEvent("fittrack:navigate", { detail: "dashboard" }),
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        <motion.button
          type="button"
          onClick={goBack}
          data-ocid="strength.back_button"
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
        <div
          className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: AMBER }}
        />
        <div
          className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: BLUE }}
        />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="text-xs font-bold tracking-[0.4em] uppercase mb-4"
              style={{ color: AMBER }}
            >
              ▸ TRAINING DISCIPLINE
            </div>
            <h1 className="font-display font-bold text-6xl md:text-8xl text-foreground tracking-tight uppercase leading-none mb-4">
              STRENGTH
              <br />
              <span style={{ color: AMBER }}>TRAINING</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mt-6 leading-relaxed">
              Iron your discipline. Forge your body. Six compound movements —
              the foundation of raw, lasting strength that transforms your
              physique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Exercises Grid */}
      <section className="max-w-[1400px] mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">
            Core Exercises
          </h2>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Master the fundamentals
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {strengthItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              data-ocid={`strength.${item.id}.card`}
              className="group cult-border rounded-xl overflow-hidden cursor-pointer bg-card"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
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
                <span
                  className="absolute top-3 right-3 text-[10px] font-bold tracking-wide px-2 py-1 rounded-full border"
                  style={{
                    color: item.diffColor,
                    borderColor: `${item.diffColor}60`,
                    background: "rgba(0,0,0,0.7)",
                  }}
                >
                  {item.difficulty}
                </span>
              </div>
              <div className="p-5">
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                  {item.desc}
                </p>
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
            Training Programs
          </h2>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            Pick your path to strength
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
              data-ocid={`strength.${prog.id}.card`}
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
              <p
                className="text-xs font-medium tracking-widest uppercase mb-3"
                style={{ color: prog.levelColor }}
              >
                {prog.goal}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {prog.desc}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: Clock, label: prog.duration },
                  { icon: Zap, label: prog.frequency },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 p-2.5 rounded-lg"
                    style={{ background: `${prog.levelColor}10` }}
                  >
                    <Icon
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: prog.levelColor }}
                    />
                    <span className="text-[11px] text-foreground/60">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {prog.lifts.map((lift) => (
                  <div
                    key={lift}
                    className="flex items-center gap-2 text-xs text-foreground/60"
                  >
                    <Dumbbell
                      className="w-3 h-3 shrink-0"
                      style={{ color: prog.levelColor }}
                    />
                    {lift}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Muscle Groups */}
      <section className="max-w-[1400px] mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">
            Muscle Groups
          </h2>
          <p className="text-sm text-muted-foreground mt-1 tracking-widest uppercase">
            What you build with strength training
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {muscleGroups.map((mg) => (
            <motion.div
              key={mg.name}
              variants={itemVariants}
              className="cult-border rounded-xl p-5 flex items-start gap-4 bg-card"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${mg.color}20`,
                  border: `1px solid ${mg.color}40`,
                }}
              >
                <Target className="w-5 h-5" style={{ color: mg.color }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground mb-1 tracking-tight">
                  {mg.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mg.exercises}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
