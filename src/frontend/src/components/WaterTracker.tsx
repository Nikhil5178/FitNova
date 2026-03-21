import { motion } from "motion/react";
import { useMemo, useState } from "react";

const DAILY_TARGET = 8;
const ML_PER_GLASS = 250;
const GLASS_NUMBERS: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8];

function getTodayKey() {
  return `fittrack_water_${new Date().toISOString().slice(0, 10)}`;
}

function getCount(): number {
  try {
    return Number(localStorage.getItem(getTodayKey()) ?? "0");
  } catch {
    return 0;
  }
}

export function WaterTracker() {
  const [count, setCount] = useState<number>(() => getCount());

  const fillPct = useMemo(
    () => Math.min((count / DAILY_TARGET) * 100, 100),
    [count],
  );
  const totalMl = count * ML_PER_GLASS;
  const targetMl = DAILY_TARGET * ML_PER_GLASS;

  function add() {
    if (count >= DAILY_TARGET) return;
    const next = count + 1;
    setCount(next);
    localStorage.setItem(getTodayKey(), String(next));
  }

  function remove() {
    if (count <= 0) return;
    const next = count - 1;
    setCount(next);
    localStorage.setItem(getTodayKey(), String(next));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="water.card"
      className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col items-center gap-4"
    >
      <div className="w-full flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Water Intake
          </h3>
          <p className="text-sm text-muted-foreground">Today's hydration</p>
        </div>
        <div className="text-right">
          <p
            className="text-2xl font-bold font-display"
            style={{ color: "oklch(0.65 0.22 240)" }}
          >
            {totalMl}ml
          </p>
          <p className="text-xs text-muted-foreground">/ {targetMl}ml</p>
        </div>
      </div>

      {/* Animated bottle SVG */}
      <div className="relative w-20 h-36 select-none">
        <svg
          viewBox="0 0 80 140"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Water bottle fill level"
        >
          <path
            d="M25,20 L20,40 L15,50 L15,125 Q15,135 25,135 L55,135 Q65,135 65,125 L65,50 L60,40 L55,20 Z"
            fill="oklch(0.15 0.03 240)"
            stroke="oklch(0.35 0.08 240)"
            strokeWidth="1.5"
          />
          <defs>
            <clipPath id="bottle-clip">
              <path d="M16,50 L16,125 Q16,134 25,134 L55,134 Q64,134 64,125 L64,50 Z" />
            </clipPath>
          </defs>
          <motion.rect
            x="16"
            width="48"
            y={50 + 75 * (1 - fillPct / 100)}
            height={75 * (fillPct / 100)}
            fill="oklch(0.55 0.20 240)"
            clipPath="url(#bottle-clip)"
            animate={{
              y: 50 + 75 * (1 - fillPct / 100),
              height: 75 * (fillPct / 100),
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              filter: "drop-shadow(0 0 4px oklch(0.65 0.22 240 / 0.6))",
            }}
          />
          <rect
            x="30"
            y="12"
            width="20"
            height="12"
            rx="3"
            fill="oklch(0.25 0.05 240)"
            stroke="oklch(0.35 0.08 240)"
            strokeWidth="1"
          />
          <rect
            x="20"
            y="55"
            width="4"
            height="60"
            rx="2"
            fill="oklch(1 0 0 / 0.08)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-sm font-bold"
            style={{ color: "oklch(0.90 0.05 240)" }}
          >
            {Math.round(fillPct)}%
          </span>
        </div>
      </div>

      {/* Glass icons — stable numeric keys 1-8 */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {GLASS_NUMBERS.map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => (n <= count ? remove() : add())}
            data-ocid="water.toggle"
            className="text-xl transition-all duration-200 hover:scale-110"
            title={n <= count ? "Remove a glass" : "Add a glass"}
          >
            {n <= count ? "💧" : "🫙"}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="water.secondary_button"
          onClick={remove}
          disabled={count <= 0}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-lg font-bold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all disabled:opacity-30"
        >
          −
        </button>
        <span className="text-sm text-muted-foreground min-w-[60px] text-center">
          {count} / {DAILY_TARGET} glasses
        </span>
        <button
          type="button"
          data-ocid="water.primary_button"
          onClick={add}
          disabled={count >= DAILY_TARGET}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30"
          style={{
            background: "oklch(0.65 0.22 240)",
            boxShadow: "0 0 12px oklch(0.65 0.22 240 / 0.5)",
            color: "white",
          }}
        >
          +
        </button>
      </div>

      {count >= DAILY_TARGET && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm font-bold"
          style={{ color: "oklch(0.75 0.18 160)" }}
        >
          🎉 Daily goal reached!
        </motion.p>
      )}
    </motion.div>
  );
}
