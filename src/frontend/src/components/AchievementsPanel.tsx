import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

const BADGES: BadgeDef[] = [
  {
    id: "first_step",
    emoji: "🏃",
    name: "First Step",
    description: "Log your first workout",
  },
  {
    id: "on_fire",
    emoji: "🔥",
    name: "On Fire",
    description: "Log 3 workouts",
  },
  {
    id: "getting_strong",
    emoji: "💪",
    name: "Getting Strong",
    description: "Log 10 workouts",
  },
  {
    id: "champion",
    emoji: "🏆",
    name: "Champion",
    description: "Log 25 workouts",
  },
  {
    id: "goal_setter",
    emoji: "🎯",
    name: "Goal Setter",
    description: "Set your first goal",
  },
  {
    id: "goal_crusher",
    emoji: "✅",
    name: "Goal Crusher",
    description: "Complete a goal (100%)",
  },
  {
    id: "nutrition_start",
    emoji: "🥗",
    name: "Nutrition Start",
    description: "Log your first meal",
  },
  {
    id: "week_warrior",
    emoji: "📅",
    name: "Week Warrior",
    description: "Log on 5+ different days",
  },
  {
    id: "streak_master",
    emoji: "🌟",
    name: "Streak Master",
    description: "Log 7 days in a row",
  },
  {
    id: "know_yourself",
    emoji: "🧠",
    name: "Know Yourself",
    description: "Complete the onboarding quiz",
  },
  {
    id: "hydrated",
    emoji: "💧",
    name: "Hydrated",
    description: "Starter badge — always yours",
  },
  {
    id: "elite_tracker",
    emoji: "🚀",
    name: "Elite Tracker",
    description: "Unlock 5 other badges",
  },
];

function getUnlockedSet(): Set<string> {
  const workouts: Array<{ date?: string }> = JSON.parse(
    localStorage.getItem("fittrack_workouts") ?? "[]",
  );
  const goals: Array<{ currentValue?: number; targetValue?: number }> =
    JSON.parse(localStorage.getItem("fittrack_goals") ?? "[]");
  const meals: unknown[] = JSON.parse(
    localStorage.getItem("fittrack_meals") ?? "[]",
  );
  const onboarding = localStorage.getItem("fittrack_onboarding");

  const uniqueDates = new Set(
    workouts.map((w) => (w.date ?? "").slice(0, 10)).filter(Boolean),
  );

  // 7-day streak check
  let hasStreak = false;
  if (uniqueDates.size >= 7) {
    const today = new Date();
    let streak = true;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (!uniqueDates.has(key)) {
        streak = false;
        break;
      }
    }
    hasStreak = streak;
  }

  const baseUnlocked = new Set<string>();
  if (workouts.length >= 1) baseUnlocked.add("first_step");
  if (workouts.length >= 3) baseUnlocked.add("on_fire");
  if (workouts.length >= 10) baseUnlocked.add("getting_strong");
  if (workouts.length >= 25) baseUnlocked.add("champion");
  if (goals.length >= 1) baseUnlocked.add("goal_setter");
  if (goals.some((g) => Number(g.currentValue) >= Number(g.targetValue)))
    baseUnlocked.add("goal_crusher");
  if (meals.length >= 1) baseUnlocked.add("nutrition_start");
  if (uniqueDates.size >= 5) baseUnlocked.add("week_warrior");
  if (hasStreak) baseUnlocked.add("streak_master");
  if (onboarding) baseUnlocked.add("know_yourself");
  baseUnlocked.add("hydrated"); // always unlocked

  if (baseUnlocked.size >= 5) baseUnlocked.add("elite_tracker");

  return baseUnlocked;
}

export function AchievementsPanel() {
  const unlocked = useMemo(() => getUnlockedSet(), []);

  useEffect(() => {
    const seen: string[] = JSON.parse(
      localStorage.getItem("fittrack_achievements_seen") ?? "[]",
    );
    const seenSet = new Set(seen);
    const newlyUnlocked = [...unlocked].filter((id) => !seenSet.has(id));

    if (newlyUnlocked.length > 0) {
      for (const id of newlyUnlocked) {
        const badge = BADGES.find((b) => b.id === id);
        if (badge) {
          setTimeout(() => {
            toast.success(
              `${badge.emoji} ${badge.name} — Achievement Unlocked!`,
              {
                duration: 4000,
              },
            );
          }, 600);
        }
      }
      localStorage.setItem(
        "fittrack_achievements_seen",
        JSON.stringify([...unlocked]),
      );
    }
  }, [unlocked]);

  const unlockedCount = unlocked.size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl bg-card border border-border p-6 shadow-card glow-card"
      data-ocid="achievements.panel"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-2xl font-display font-bold text-foreground">
            Achievements
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Unlock badges as you train harder
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/30 self-start sm:self-auto"
          data-ocid="achievements.section"
        >
          <span className="text-xl">🏅</span>
          <span className="text-sm font-bold text-foreground">
            <span style={{ color: "oklch(0.84 0.18 80)" }}>
              {unlockedCount}
            </span>
            <span className="text-muted-foreground"> / 12 Unlocked</span>
          </span>
        </div>
      </div>

      {/* Badge grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        data-ocid="achievements.list"
      >
        {BADGES.map((badge, i) => {
          const isUnlocked = unlocked.has(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              data-ocid={`achievements.item.${i + 1}`}
              className="relative flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-300"
              style={{
                background: isUnlocked
                  ? "oklch(var(--card))"
                  : "color-mix(in oklch, var(--card), transparent 40%)",
                borderColor: isUnlocked
                  ? "oklch(0.84 0.18 80 / 0.4)"
                  : "oklch(0.3 0.02 240 / 0.5)",
                boxShadow: isUnlocked
                  ? "0 0 20px oklch(0.84 0.18 80 / 0.25)"
                  : "none",
                filter: isUnlocked ? "none" : "grayscale(1)",
                opacity: isUnlocked ? 1 : 0.4,
              }}
            >
              {/* Shimmer pulse for unlocked */}
              {isUnlocked && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ background: "oklch(0.84 0.18 80 / 0.06)" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Lock icon overlay for locked */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}

              <span className="text-3xl mb-2 relative z-10">{badge.emoji}</span>
              <span className="text-sm font-display font-bold text-foreground relative z-10 leading-tight">
                {badge.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1 relative z-10 leading-snug">
                {badge.description}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
