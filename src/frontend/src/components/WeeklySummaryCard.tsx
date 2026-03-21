import { motion } from "motion/react";
import { useMemo } from "react";

function getWeekRange() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function parseDate(val: string | number | undefined): Date | null {
  if (!val) return null;
  let ms: number;
  if (typeof val === "string" && /^\d+n?$/.test(val)) {
    ms = Number(val.replace("n", ""));
  } else if (typeof val === "number") {
    ms = val;
  } else {
    ms = new Date(val as string).getTime();
  }
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function WeeklySummaryCard() {
  const summary = useMemo(() => {
    const { monday, sunday } = getWeekRange();
    try {
      const workouts: Array<{
        date?: string | number;
        caloriesBurned?: string | number;
      }> = JSON.parse(localStorage.getItem("fittrack_workouts") ?? "[]");
      const meals: Array<{
        date?: string | number;
        calories?: string | number;
      }> = JSON.parse(localStorage.getItem("fittrack_meals") ?? "[]");
      const goals: Array<{
        currentValue?: string | number;
        targetValue?: string | number;
      }> = JSON.parse(localStorage.getItem("fittrack_goals") ?? "[]");

      const weekWorkouts = workouts.filter((w) => {
        const d = parseDate(w.date);
        return d && d >= monday && d <= sunday;
      });

      const weekMeals = meals.filter((m) => {
        const d = parseDate(m.date);
        return d && d >= monday && d <= sunday;
      });

      const totalCalories = weekMeals.reduce(
        (sum, m) => sum + Number(String(m.calories ?? 0).replace("n", "")),
        0,
      );

      const activeDays = new Set(
        weekWorkouts
          .map((w) => parseDate(w.date)?.toISOString().slice(0, 10))
          .filter(Boolean),
      ).size;

      const goalsInProgress = goals.filter(
        (g) =>
          Number(String(g.currentValue ?? 0).replace("n", "")) <
          Number(String(g.targetValue ?? 0).replace("n", "")),
      ).length;

      return {
        workouts: weekWorkouts.length,
        calories: totalCalories,
        activeDays,
        goalsInProgress,
      };
    } catch {
      return { workouts: 0, calories: 0, activeDays: 0, goalsInProgress: 0 };
    }
  }, []);

  const motivation = useMemo(() => {
    const { activeDays, workouts } = summary;
    if (activeDays >= 6)
      return {
        msg: "You're on an absolute tear this week. LEGENDARY.",
        emoji: "🔥",
      };
    if (activeDays >= 4)
      return {
        msg: "Crushing it! Your consistency is building real results.",
        emoji: "💪",
      };
    if (activeDays >= 2)
      return {
        msg: "Good week! Push for one more session and feel the difference.",
        emoji: "⚡",
      };
    if (workouts >= 1)
      return {
        msg: "You've started — that's everything. Keep the momentum.",
        emoji: "🌱",
      };
    return {
      msg: "A new week awaits. Log your first workout and ignite the streak.",
      emoji: "🎯",
    };
  }, [summary]);

  const stats = [
    {
      label: "Workouts",
      value: summary.workouts,
      color: "oklch(0.65 0.22 240)",
      icon: "🏋️",
    },
    {
      label: "Calories",
      value: summary.calories.toLocaleString(),
      color: "oklch(0.75 0.18 50)",
      icon: "🔥",
    },
    {
      label: "Active Days",
      value: summary.activeDays,
      color: "oklch(0.75 0.18 160)",
      icon: "📅",
    },
    {
      label: "Goals Active",
      value: summary.goalsInProgress,
      color: "oklch(0.75 0.20 300)",
      icon: "🎯",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="weekly.card"
      className="rounded-2xl border border-border p-6 overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.04 240), oklch(0.10 0.03 260))",
        borderColor: "oklch(0.30 0.08 240 / 0.5)",
      }}
    >
      {/* Accent blob */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 240 / 0.15), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-5">
          <span className="text-3xl">{motivation.emoji}</span>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">
              This Week
            </h3>
            <p
              className="text-sm mt-0.5"
              style={{ color: "oklch(0.75 0.08 240)" }}
            >
              {motivation.msg}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              data-ocid={`weekly.item.${i + 1}`}
              className="flex flex-col items-center text-center p-3 rounded-xl"
              style={{ background: "oklch(0.08 0.02 240 / 0.6)" }}
            >
              <span className="text-2xl mb-1">{stat.icon}</span>
              <span
                className="text-2xl font-bold font-display"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
