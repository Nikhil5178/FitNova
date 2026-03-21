import { motion } from "motion/react";
import { useMemo } from "react";

const MOCK_USERS = [
  { username: "IronBeastXX", xp: 14850 },
  { username: "GainzGodQuinn", xp: 13200 },
  { username: "PlatinumPulse", xp: 11750 },
  { username: "SweatArchitect", xp: 10440 },
  { username: "VaultBreaker99", xp: 9800 },
  { username: "DeepSquatDeva", xp: 8650 },
  { username: "ChainedHercules", xp: 7400 },
  { username: "NightshadeRep", xp: 6200 },
  { username: "CarbKillerElite", xp: 5100 },
  { username: "FirstRepFrenzy", xp: 3900 },
];

const MEDALS = ["🥇", "🥈", "🥉"];
const ACCENT = "oklch(0.65 0.22 240)";
const MAX_XP = MOCK_USERS[0].xp;

function getSession(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem("fittrack_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getUserXP(): number {
  try {
    const workouts = JSON.parse(
      localStorage.getItem("fittrack_workouts") ?? "[]",
    );
    const goals = JSON.parse(localStorage.getItem("fittrack_goals") ?? "[]");
    return workouts.length * 100 + goals.length * 50;
  } catch {
    return 0;
  }
}

export function LeaderboardSection() {
  const session = getSession();
  const userXP = useMemo(getUserXP, []);

  const leaderboardWithUser = useMemo(() => {
    if (!session) return MOCK_USERS;
    const userEntry = {
      username: session.name || "You",
      xp: userXP,
      isCurrentUser: true,
    };
    const all = [
      ...MOCK_USERS.map((u) => ({ ...u, isCurrentUser: false })),
      userEntry,
    ];
    return all.sort((a, b) => b.xp - a.xp);
  }, [session, userXP]);

  const displayMax = Math.max(MAX_XP, userXP);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="leaderboard.section"
      className="rounded-2xl border p-6 overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, oklch(var(--card)), oklch(var(--card)))",
        borderColor: `${ACCENT}30`,
      }}
    >
      {/* Blob */}
      <div
        className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 240 / 0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏆</span>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">
              Leaderboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Top athletes ranked by XP this week
            </p>
          </div>
        </div>

        <div className="space-y-2" data-ocid="leaderboard.list">
          {leaderboardWithUser.slice(0, 10).map((user, i) => {
            const isCurrentUser = (user as { isCurrentUser?: boolean })
              .isCurrentUser;
            const rank = i + 1;
            return (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                data-ocid={`leaderboard.item.${rank}`}
                className="flex items-center gap-4 p-3 rounded-xl transition-all"
                style={{
                  background: isCurrentUser
                    ? `${ACCENT}15`
                    : "color-mix(in oklch, var(--card), transparent 40%)",
                  border: `1px solid ${isCurrentUser ? `${ACCENT}50` : "transparent"}`,
                  boxShadow: isCurrentUser ? `0 0 16px ${ACCENT}20` : "none",
                }}
              >
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {rank <= 3 ? (
                    <span className="text-xl">{MEDALS[rank - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: isCurrentUser
                      ? `${ACCENT}30`
                      : "oklch(var(--card))",
                    color: isCurrentUser
                      ? ACCENT
                      : "oklch(var(--muted-foreground))",
                    border: `1px solid ${isCurrentUser ? ACCENT : "oklch(var(--border))"}`,
                  }}
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </div>

                {/* Username */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-bold truncate"
                    style={{
                      color: isCurrentUser
                        ? ACCENT
                        : "oklch(var(--foreground))",
                    }}
                  >
                    {user.username}
                    {isCurrentUser && (
                      <span className="ml-2 text-[10px] font-normal opacity-70">
                        (you)
                      </span>
                    )}
                  </p>
                  {/* XP bar */}
                  <div
                    className="mt-1 h-1 rounded-full overflow-hidden"
                    style={{ background: "oklch(var(--card))" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(user.xp / displayMax) * 100}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: isCurrentUser
                          ? `linear-gradient(90deg, ${ACCENT}, oklch(0.75 0.18 200))`
                          : rank === 1
                            ? "linear-gradient(90deg, oklch(0.80 0.16 50), oklch(0.76 0.18 55))"
                            : "linear-gradient(90deg, oklch(0.50 0.10 240), oklch(0.45 0.08 240))",
                      }}
                    />
                  </div>
                </div>

                {/* XP value */}
                <div className="text-right flex-shrink-0">
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: isCurrentUser ? ACCENT : "oklch(0.75 0.08 240)",
                    }}
                  >
                    {user.xp.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-0.5">
                    XP
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Not logged in prompt */}
        {!session && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl"
            style={{
              background: `${ACCENT}10`,
              border: `1px dashed ${ACCENT}30`,
            }}
          >
            <span className="text-sm text-muted-foreground">
              Sign in to see your rank on the leaderboard
            </span>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("fittrack:open_auth"))
              }
              data-ocid="leaderboard.primary_button"
              className="text-sm font-bold"
              style={{ color: ACCENT }}
            >
              Sign In →
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
