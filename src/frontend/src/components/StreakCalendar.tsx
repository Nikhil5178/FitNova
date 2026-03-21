import { motion } from "motion/react";
import { useMemo } from "react";

function getWorkoutDates(): Set<string> {
  try {
    const workouts: Array<{ date?: string | number }> = JSON.parse(
      localStorage.getItem("fittrack_workouts") ?? "[]",
    );
    const dates = new Set<string>();
    for (const w of workouts) {
      if (!w.date) continue;
      let d: Date;
      if (typeof w.date === "string" && /^\d+n?$/.test(w.date)) {
        d = new Date(Number(w.date.replace("n", "")));
      } else if (typeof w.date === "number") {
        d = new Date(w.date);
      } else {
        d = new Date(w.date as string);
      }
      if (!Number.isNaN(d.getTime())) {
        dates.add(d.toISOString().slice(0, 10));
      }
    }
    return dates;
  } catch {
    return new Set();
  }
}

function calcStreak(dates: Set<string>): { current: number; longest: number } {
  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      if (i === 0 || current > 0) current++;
    } else {
      if (i === 0) current = 0;
      else break;
    }
  }
  const sorted = [...dates].sort();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      streak = 1;
      longest = 1;
      continue;
    }
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
      if (streak > longest) longest = streak;
    } else {
      streak = 1;
    }
  }
  return { current, longest };
}

export function StreakCalendar() {
  const workoutDates = useMemo(() => getWorkoutDates(), []);

  const days = useMemo(() => {
    const result: Array<{ date: string; count: number }> = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, count: workoutDates.has(key) ? 1 : 0 });
    }
    return result;
  }, [workoutDates]);

  const { current: currentStreak, longest: longestStreak } = useMemo(
    () => calcStreak(workoutDates),
    [workoutDates],
  );

  const weeks: Array<Array<{ date: string; count: number }>> = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const MONTH_LABELS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function cellColor(count: number) {
    if (count === 0) return "oklch(0.18 0.02 240)";
    return "oklch(0.65 0.22 240)";
  }

  function cellGlow(count: number) {
    if (count === 0) return "none";
    return "0 0 8px oklch(0.65 0.22 240 / 0.7)";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="streak.card"
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Activity Streak
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your last 12 weeks of training
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <p
              className="text-2xl font-bold font-display"
              style={{ color: "oklch(0.65 0.22 240)" }}
            >
              {currentStreak}
            </p>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p
              className="text-2xl font-bold font-display"
              style={{ color: "oklch(0.84 0.18 80)" }}
            >
              {longestStreak}
            </p>
            <p className="text-xs text-muted-foreground">Longest streak</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wi) => {
            const weekKey = week[0]?.date ?? String(wi);
            return (
              <div key={weekKey} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={day.date}
                    className="w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125"
                    style={{
                      background: cellColor(day.count),
                      boxShadow: cellGlow(day.count),
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-2 min-w-max">
          {weeks.map((week) => {
            const firstDay = new Date(week[0].date);
            const showLabel = firstDay.getDate() <= 7;
            const weekKey = `label-${week[0].date}`;
            return (
              <div key={weekKey} className="w-3 text-center">
                {showLabel && (
                  <span className="text-[9px] text-muted-foreground">
                    {MONTH_LABELS[firstDay.getMonth()]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-muted-foreground">Less</span>
        {([0, 0.3, 0.6, 1] as const).map((opacity) => (
          <div
            key={opacity}
            className="w-3 h-3 rounded-sm"
            style={{
              background:
                opacity === 0
                  ? "oklch(0.18 0.02 240)"
                  : `oklch(0.65 0.22 240 / ${opacity})`,
            }}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </motion.div>
  );
}
