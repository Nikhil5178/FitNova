import { Apple, Bike, Dumbbell, Flame, Footprints, Wind } from "lucide-react";
import { motion } from "motion/react";
import { useWorkouts } from "../hooks/useQueries";

const MOCK_ACTIVITIES = [
  {
    icon: <Dumbbell className="w-4 h-4" />,
    label: "Chest & Shoulders Workout",
    sub: "45 min · 420 kcal",
    time: "2 hours ago",
    color: "bg-primary/15 text-primary",
    glow: "oklch(0.82 0.18 195 / 0.2)",
  },
  {
    icon: <Footprints className="w-4 h-4" />,
    label: "Morning Walk",
    sub: "5.2 km · 3,840 steps",
    time: "5 hours ago",
    color: "bg-accent/15 text-accent",
    glow: "oklch(0.84 0.19 120 / 0.2)",
  },
  {
    icon: <Bike className="w-4 h-4" />,
    label: "Cycling Session",
    sub: "32 min · 380 kcal",
    time: "Yesterday",
    color: "bg-chart-3/15 text-chart-3",
    glow: "oklch(0.7 0.15 220 / 0.2)",
  },
  {
    icon: <Wind className="w-4 h-4" />,
    label: "Yoga & Stretching",
    sub: "30 min · Flow session",
    time: "Yesterday",
    color: "bg-chart-4/15 text-chart-4",
    glow: "oklch(0.75 0.18 160 / 0.2)",
  },
  {
    icon: <Flame className="w-4 h-4" />,
    label: "HIIT Cardio",
    sub: "25 min · 520 kcal",
    time: "2 days ago",
    color: "bg-destructive/15 text-destructive",
    glow: "oklch(0.64 0.22 25 / 0.2)",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export function RecentActivity() {
  const { data: workouts } = useWorkouts();

  const activities =
    workouts && workouts.length > 0
      ? workouts.slice(0, 5).map((w, i) => ({
          icon: <Dumbbell className="w-4 h-4" />,
          label: `${w.workoutType.charAt(0).toUpperCase() + w.workoutType.slice(1)} Workout`,
          sub: `${Number(w.duration)} min · ${Number(w.caloriesBurned)} kcal`,
          time: new Date(Number(w.date) / 1_000_000).toLocaleDateString(),
          color: "bg-primary/15 text-primary",
          glow: "oklch(0.82 0.18 195 / 0.2)",
          id: i,
        }))
      : MOCK_ACTIVITIES.map((a, i) => ({ ...a, id: i }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      data-ocid="activity.card"
      className="rounded-2xl bg-card border border-border p-6 shadow-card glow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground">
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground">Your latest sessions</p>
        </div>
        <span className="text-xs text-primary hover:text-primary/80 cursor-pointer font-semibold transition-colors">
          View all →
        </span>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-2.5"
        data-ocid="activity.list"
      >
        {activities.map((a, i) => (
          <motion.div
            key={a.id}
            variants={itemVariants}
            data-ocid={`activity.item.${i + 1}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all group"
          >
            <div
              className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center flex-shrink-0 transition-shadow group-hover:shadow-md`}
              style={{ transition: "box-shadow 0.3s" }}
            >
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {a.label}
              </p>
              <p className="text-xs text-muted-foreground">{a.sub}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {a.time}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
