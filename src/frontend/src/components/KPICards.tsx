import { Apple, Dumbbell, Footprints, HeartPulse } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMeals, useStepCounts, useWorkouts } from "../hooks/useQueries";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || target === 0) return;
    startedRef.current = true;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

function CircularProgress({
  value,
  max,
  label,
  color,
}: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min(value / max, 1);
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <title>
          {label}: {Math.round(pct * 100)}%
        </title>
        <circle
          cx="42"
          cy="42"
          r={r}
          stroke="oklch(0.14 0.006 260)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="42"
          cy="42"
          r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 42 42)"
          style={{
            transition: "stroke-dasharray 1.2s ease",
            filter: `drop-shadow(0 0 5px ${color})`,
          }}
        />
        <text
          x="42"
          y="46"
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
        >
          {value === 0 ? "—" : `${Math.round(pct * 100)}%`}
        </text>
      </svg>
      <span className="data-label mt-1">{label}</span>
    </div>
  );
}

const MOCK_HR = [68, 72, 75, 71, 78, 82, 76, 74];

function HeartRateMini() {
  const max = Math.max(...MOCK_HR);
  const min = Math.min(...MOCK_HR);
  const h = 36;
  const w = 80;
  const points = MOCK_HR.map((v, i) => {
    const x = (i / (MOCK_HR.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <title>Heart rate over time</title>
      <polyline
        points={points}
        fill="none"
        stroke="oklch(0.65 0.22 240)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px oklch(0.65 0.22 240 / 0.8))" }}
      />
    </svg>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="text-xs text-muted-foreground/60 mt-2 tracking-wide uppercase">
      {text}
    </p>
  );
}

function WorkoutCard({
  todayDuration,
  todayCals,
}: { todayDuration: number; todayCals: number }) {
  const dur = useCountUp(todayDuration);
  const cals = useCountUp(todayCals);
  const isEmpty = todayDuration === 0;
  return (
    <div className="mt-4">
      <div className="text-4xl font-bold text-foreground">
        {isEmpty ? "0" : dur}
        <span className="text-sm font-normal text-muted-foreground ml-1">
          min
        </span>
      </div>
      <div className="data-label mt-2">{isEmpty ? "0" : cals} kcal burned</div>
      {isEmpty ? (
        <EmptyHint text="Log your first workout" />
      ) : (
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {["Chest", "Shoulders", "Triceps"].map((m) => (
            <span
              key={m}
              className="text-xs px-2 py-0.5 border border-primary/30 text-primary font-medium tracking-wide"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StepsCard({ todaySteps }: { todaySteps: number }) {
  const steps = useCountUp(todaySteps);
  const isEmpty = todaySteps === 0;
  return (
    <div className="mt-3 flex items-center justify-between">
      <div>
        <div className="text-4xl font-bold text-foreground">
          {isEmpty ? "0" : steps.toLocaleString()}
        </div>
        <div className="data-label mt-2">Goal: 10,000</div>
        {isEmpty && <EmptyHint text="Start tracking steps" />}
      </div>
      <CircularProgress
        value={todaySteps}
        max={10000}
        label="Steps"
        color="oklch(0.76 0.16 55)"
      />
    </div>
  );
}

function NutritionCard({
  totalCalsIn,
  totalProtein,
}: { totalCalsIn: number; totalProtein: number }) {
  const cals = useCountUp(totalCalsIn);
  const isEmpty = totalCalsIn === 0;
  return (
    <div className="mt-4 space-y-2.5">
      <div className="text-4xl font-bold text-foreground">
        {isEmpty ? "0" : cals.toLocaleString()}
        <span className="text-sm font-normal text-muted-foreground ml-1">
          kcal
        </span>
      </div>
      {isEmpty ? (
        <EmptyHint text="No data yet — add a meal" />
      ) : (
        [
          {
            label: "Protein",
            val: totalProtein,
            max: 180,
            color: "oklch(0.65 0.22 240)",
          },
          { label: "Carbs", val: 180, max: 250, color: "oklch(0.76 0.16 55)" },
          { label: "Fat", val: 55, max: 80, color: "oklch(0.68 0.16 175)" },
        ].map((n) => (
          <div key={n.label}>
            <div className="flex justify-between mb-1">
              <span className="data-label">{n.label}</span>
              <span className="data-label">{n.val}g</span>
            </div>
            <div className="h-1 bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${Math.min((n.val / n.max) * 100, 100)}%`,
                  background: n.color,
                  boxShadow: `0 0 8px ${n.color}`,
                }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function KPICards() {
  const { data: workouts } = useWorkouts();
  const { data: meals } = useMeals();
  const { data: steps } = useStepCounts();

  const todayWorkouts =
    workouts?.filter((w) => {
      const d = new Date(Number(w.date) / 1_000_000);
      return d.toDateString() === new Date().toDateString();
    }) ?? [];

  const todayCals = todayWorkouts.reduce(
    (s, w) => s + Number(w.caloriesBurned),
    0,
  );
  const todayDuration = todayWorkouts.reduce(
    (s, w) => s + Number(w.duration),
    0,
  );

  const todaySteps = (() => {
    if (!steps || steps.length === 0) return 0;
    const today = new Date();
    const ts = steps.filter((s) => {
      const d = new Date(Number(s.date) / 1_000_000);
      return d.toDateString() === today.toDateString();
    });
    return ts.reduce((sum, s) => sum + Number(s.steps), 0);
  })();

  const todayMeals =
    meals?.filter((m) => {
      const d = new Date(Number(m.date) / 1_000_000);
      return d.toDateString() === new Date().toDateString();
    }) ?? [];

  const totalCalsIn = todayMeals.reduce((s, m) => s + Number(m.calories), 0);
  const totalProtein = todayMeals.reduce((s, m) => s + Number(m.protein), 0);

  const cards = [
    {
      id: "workout",
      title: "Workout Today",
      icon: <Dumbbell className="w-4 h-4" />,
      iconColor: "text-primary",
      topBorder: "oklch(0.65 0.22 240)",
      content: (
        <WorkoutCard todayDuration={todayDuration} todayCals={todayCals} />
      ),
    },
    {
      id: "steps",
      title: "Daily Steps",
      icon: <Footprints className="w-4 h-4" />,
      iconColor: "text-accent",
      topBorder: "oklch(0.76 0.16 55)",
      content: <StepsCard todaySteps={todaySteps} />,
    },
    {
      id: "nutrition",
      title: "Nutrition Today",
      icon: <Apple className="w-4 h-4" />,
      iconColor: "text-chart-4",
      topBorder: "oklch(0.68 0.16 175)",
      content: (
        <NutritionCard totalCalsIn={totalCalsIn} totalProtein={totalProtein} />
      ),
    },
    {
      id: "heartrate",
      title: "Heart Rate",
      icon: <HeartPulse className="w-4 h-4" />,
      iconColor: "text-primary",
      topBorder: "oklch(0.65 0.22 240)",
      content: (
        <div className="mt-4">
          <div className="text-4xl font-bold text-foreground">
            74
            <span className="text-sm font-normal text-muted-foreground ml-1">
              bpm
            </span>
          </div>
          <div className="data-label mt-2">Resting · Excellent</div>
          <div className="mt-3">
            <HeartRateMini />
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {cards.map((card) => (
        <motion.div
          key={card.id}
          variants={itemVariants}
          data-ocid={`${card.id}.card`}
          className="rounded-xl bg-card cult-border p-5 shadow-card glow-card transition-all"
          style={{ borderTop: `2px solid ${card.topBorder}` }}
        >
          <div className="flex items-start justify-between">
            <span className="data-label">{card.title}</span>
            <span className={card.iconColor}>{card.icon}</span>
          </div>
          {card.content}
        </motion.div>
      ))}
    </motion.div>
  );
}
