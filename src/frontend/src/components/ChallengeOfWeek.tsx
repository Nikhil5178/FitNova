import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CHALLENGES = [
  {
    title: "100 Push-Up Challenge",
    description:
      "Complete 100 push-ups spread across the day. Any variation counts.",
    icon: "💪",
    xp: 150,
    difficulty: "Medium",
  },
  {
    title: "10K Steps Every Day",
    description:
      "Hit 10,000 steps each day this week. Track with your phone or watch.",
    icon: "👟",
    xp: 120,
    difficulty: "Easy",
  },
  {
    title: "5-Minute Plank Cumulative",
    description:
      "Hold planks totaling 5 minutes today. Break into sets as needed.",
    icon: "🧱",
    xp: 200,
    difficulty: "Hard",
  },
  {
    title: "Morning Mobility Flow",
    description: "Do 10 minutes of stretching or yoga every morning this week.",
    icon: "🧘",
    xp: 100,
    difficulty: "Easy",
  },
  {
    title: "Cold Shower Protocol",
    description:
      "End every shower with 60 seconds of cold water. Build mental grit.",
    icon: "🧊",
    xp: 175,
    difficulty: "Hard",
  },
  {
    title: "No Sugar Week",
    description: "Eliminate added sugars for 7 days. Read labels, stay clean.",
    icon: "🚫🍬",
    xp: 250,
    difficulty: "Extreme",
  },
  {
    title: "3L Water Daily",
    description: "Drink at least 3 litres of water every day this week.",
    icon: "💧",
    xp: 90,
    difficulty: "Easy",
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "oklch(0.72 0.17 160)",
  Medium: "oklch(0.76 0.16 55)",
  Hard: "oklch(0.65 0.22 25)",
  Extreme: "oklch(0.65 0.22 0)",
};

function getWeekChallenge() {
  const now = new Date();
  const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  return CHALLENGES[weekNumber % CHALLENGES.length];
}

function getTimeUntilSunday() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  sunday.setHours(23, 59, 59, 999);
  const diff = sunday.getTime() - now.getTime();
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { d, h, m, s };
}

const ACCENT = "oklch(0.65 0.22 240)";

export function ChallengeOfWeek() {
  const challenge = getWeekChallenge();
  const [countdown, setCountdown] = useState(getTimeUntilSunday());
  const [accepted, setAccepted] = useState(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("fittrack_challenge_accepted") ?? "null",
      );
      return (
        data?.week === Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) &&
        data?.accepted
      );
    } catch {
      return false;
    }
  });
  const [completed, setCompleted] = useState(() => {
    try {
      const data = JSON.parse(
        localStorage.getItem("fittrack_challenge_accepted") ?? "null",
      );
      return (
        data?.week === Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) &&
        data?.completed
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getTimeUntilSunday()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleAccept() {
    const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    localStorage.setItem(
      "fittrack_challenge_accepted",
      JSON.stringify({ week, accepted: true, completed: false }),
    );
    setAccepted(true);
    toast.success("Challenge accepted! You've got this. 🔥");
  }

  function handleComplete() {
    const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    localStorage.setItem(
      "fittrack_challenge_accepted",
      JSON.stringify({ week, accepted: true, completed: true }),
    );
    setCompleted(true);
    toast.success(`+${challenge.xp} XP earned! Challenge COMPLETE! 🏆`);
  }

  const diffColor = DIFFICULTY_COLOR[challenge.difficulty] ?? ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="challenge.card"
      className="rounded-2xl border p-6 overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.11 0.04 240), oklch(0.09 0.03 265))",
        borderColor: `${ACCENT}40`,
      }}
    >
      {/* Blob */}
      <div
        className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 240 / 0.12), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{challenge.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: ACCENT }}
                >
                  CHALLENGE OF THE WEEK
                </span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${diffColor}20`, color: diffColor }}
                >
                  {challenge.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {challenge.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {challenge.description}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 text-center">
            <span
              className="text-xs font-bold"
              style={{ color: "oklch(0.76 0.16 55)" }}
            >
              +{challenge.xp} XP
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2 tracking-[0.12em] uppercase">
            Resets In
          </p>
          <div className="flex gap-3">
            {[
              { label: "Days", value: countdown.d },
              { label: "Hours", value: countdown.h },
              { label: "Mins", value: countdown.m },
              { label: "Secs", value: countdown.s },
            ].map((unit) => (
              <motion.div
                key={unit.label}
                className="flex flex-col items-center px-3 py-2 rounded-xl"
                style={{
                  background: "oklch(0.08 0.02 240 / 0.8)",
                  border: `1px solid ${ACCENT}25`,
                }}
              >
                <motion.span
                  key={unit.value}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-display font-bold tabular-nums"
                  style={{ color: ACCENT }}
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.span>
                <span className="text-[9px] text-muted-foreground tracking-widest uppercase mt-0.5">
                  {unit.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {!accepted && !completed && (
            <button
              type="button"
              onClick={handleAccept}
              data-ocid="challenge.primary_button"
              className="px-6 py-2.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300"
              style={{
                background: ACCENT,
                color: "oklch(0.08 0.005 260)",
                boxShadow: `0 0 24px ${ACCENT}40`,
              }}
            >
              Accept Challenge
            </button>
          )}
          {accepted && !completed && (
            <>
              <span
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: ACCENT }}
              >
                ✓ Accepted
              </span>
              <button
                type="button"
                onClick={handleComplete}
                data-ocid="challenge.secondary_button"
                className="px-6 py-2.5 rounded-xl text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 border"
                style={{ borderColor: `${ACCENT}60`, color: ACCENT }}
              >
                Mark Complete
              </button>
            </>
          )}
          {completed && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span
                className="text-sm font-bold"
                style={{ color: "oklch(0.76 0.16 55)" }}
              >
                Challenge Complete! +{challenge.xp} XP earned
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
