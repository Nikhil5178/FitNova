import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useWorkouts } from "../hooks/useQueries";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_DATA = [
  { day: "Mon", calories: 320, duration: 35 },
  { day: "Tue", calories: 480, duration: 50 },
  { day: "Wed", calories: 0, duration: 0 },
  { day: "Thu", calories: 560, duration: 60 },
  { day: "Fri", calories: 420, duration: 45 },
  { day: "Sat", calories: 680, duration: 75 },
  { day: "Sun", calories: 200, duration: 25 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-card">
      <p className="text-foreground font-bold text-xs tracking-widest uppercase mb-1.5">
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill }} className="text-xs">
          {p.name}:{" "}
          <strong>
            {p.value}
            {p.name === "Calories" ? " kcal" : " min"}
          </strong>
        </p>
      ))}
    </div>
  );
};

export function WeeklyProgress() {
  const { data: workouts } = useWorkouts();

  const chartData = DAYS.map((day, i) => {
    if (!workouts || workouts.length === 0) return MOCK_DATA[i];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = (dayOfWeek + 6) % 7;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - mondayOffset + i);
    const dayWorkouts = workouts.filter((w) => {
      const d = new Date(Number(w.date) / 1_000_000);
      return d.toDateString() === targetDate.toDateString();
    });
    return {
      day,
      calories: dayWorkouts.reduce((s, w) => s + Number(w.caloriesBurned), 0),
      duration: dayWorkouts.reduce((s, w) => s + Number(w.duration), 0),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="weekly_progress.card"
      className="rounded-xl bg-card cult-border p-6 shadow-card glow-card"
      style={{ borderTop: "2px solid oklch(0.65 0.22 240)" }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="data-label">Weekly Progress</span>
          <h3 className="text-foreground font-bold text-lg mt-1">
            Calories &amp; Duration
          </h3>
        </div>
        <span className="data-label border border-primary/30 px-3 py-1 text-primary">
          This Week
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid
            strokeDasharray="2 6"
            stroke="oklch(0.14 0.006 260)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "oklch(0.50 0.008 260)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "oklch(0.50 0.008 260)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: "11px",
              color: "oklch(0.50 0.008 260)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          />
          <Bar
            dataKey="calories"
            name="Calories"
            fill="oklch(0.65 0.22 240)"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="duration"
            name="Duration"
            fill="oklch(0.76 0.16 55)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
