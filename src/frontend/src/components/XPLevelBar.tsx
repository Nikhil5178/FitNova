import { motion } from "motion/react";
import { useMemo } from "react";

const LEVELS = [
  { name: "Beginner", xp: 0, icon: "🌱", rank: 1 },
  { name: "Rookie", xp: 200, icon: "⚡", rank: 2 },
  { name: "Athlete", xp: 500, icon: "🏃", rank: 3 },
  { name: "Pro", xp: 1000, icon: "💪", rank: 4 },
  { name: "Elite", xp: 2000, icon: "🏆", rank: 5 },
  { name: "Legend", xp: 5000, icon: "👑", rank: 6 },
];

function calcXP() {
  try {
    const workouts: unknown[] = JSON.parse(
      localStorage.getItem("fittrack_workouts") ?? "[]",
    );
    const meals: unknown[] = JSON.parse(
      localStorage.getItem("fittrack_meals") ?? "[]",
    );
    const goals: Array<{
      currentValue?: number | string;
      targetValue?: number | string;
    }> = JSON.parse(localStorage.getItem("fittrack_goals") ?? "[]");
    const completedGoals = goals.filter(
      (g) => Number(g.currentValue) >= Number(g.targetValue),
    ).length;
    return workouts.length * 50 + meals.length * 10 + completedGoals * 100;
  } catch {
    return 0;
  }
}

export function XPLevelBar() {
  const xp = useMemo(() => calcXP(), []);

  const currentLevelIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (xp >= LEVELS[i].xp) idx = i;
    }
    return idx;
  }, [xp]);

  const currentLevel = LEVELS[currentLevelIdx];
  const nextLevel = LEVELS[currentLevelIdx + 1];

  const pct = nextLevel
    ? Math.min(
        ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100,
        100,
      )
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="xp.card"
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
      style={{ boxShadow: "0 0 30px oklch(0.65 0.22 240 / 0.12)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Level badge */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/10 self-start">
          <span className="text-3xl">{currentLevel.icon}</span>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Rank {currentLevel.rank}
            </p>
            <p
              className="text-lg font-display font-bold"
              style={{ color: "oklch(0.65 0.22 240)" }}
            >
              {currentLevel.name}
            </p>
          </div>
        </div>

        {/* Bar section */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-foreground">
              <span
                className="font-bold"
                style={{ color: "oklch(0.65 0.22 240)" }}
              >
                {xp.toLocaleString()}
              </span>{" "}
              <span className="text-muted-foreground">XP</span>
            </span>
            {nextLevel && (
              <span className="text-xs text-muted-foreground">
                {nextLevel.xp.toLocaleString()} XP → {nextLevel.icon}{" "}
                {nextLevel.name}
              </span>
            )}
            {!nextLevel && (
              <span
                className="text-xs font-bold"
                style={{ color: "oklch(0.84 0.18 80)" }}
              >
                MAX LEVEL
              </span>
            )}
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.55 0.20 240), oklch(0.75 0.22 220))",
                boxShadow: "0 0 12px oklch(0.65 0.22 240 / 0.7)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {LEVELS.map((lvl, i) => (
              <div
                key={lvl.name}
                className="flex flex-col items-center"
                style={{ opacity: i <= currentLevelIdx ? 1 : 0.3 }}
              >
                <span className="text-xs">{lvl.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
