import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeightEntry {
  date: string;
  weight: number;
}

function loadEntries(): WeightEntry[] {
  try {
    return JSON.parse(localStorage.getItem("fittrack_weight") ?? "[]");
  } catch {
    return [];
  }
}

function saveEntries(entries: WeightEntry[]) {
  localStorage.setItem("fittrack_weight", JSON.stringify(entries));
}

export function BodyWeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>(() => loadEntries());
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weight, setWeight] = useState("");

  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  const previous = entries.length > 1 ? entries[entries.length - 2] : null;

  const trend =
    latest && previous
      ? latest.weight > previous.weight
        ? "up"
        : latest.weight < previous.weight
          ? "down"
          : "flat"
      : null;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!weight) return;
    const entry: WeightEntry = { date, weight: Number.parseFloat(weight) };
    const next = [...entries.filter((e) => e.date !== date), entry].sort(
      (a, b) => a.date.localeCompare(b.date),
    );
    setEntries(next);
    saveEntries(next);
    setOpen(false);
    setWeight("");
  }

  const chartData = entries.slice(-20).map((e) => ({
    date: e.date.slice(5), // MM-DD
    weight: e.weight,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      data-ocid="weight.card"
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Body Weight
          </h3>
          <p className="text-sm text-muted-foreground">Track your progress</p>
        </div>
        <div className="flex items-center gap-3">
          {latest && (
            <div className="flex items-center gap-1.5">
              <span
                className="text-2xl font-bold font-display"
                style={{ color: "oklch(0.65 0.22 240)" }}
              >
                {latest.weight}
              </span>
              <span className="text-sm text-muted-foreground">kg</span>
              {trend === "down" && (
                <TrendingDown
                  className="w-4 h-4"
                  style={{ color: "oklch(0.75 0.18 160)" }}
                />
              )}
              {trend === "up" && (
                <TrendingUp
                  className="w-4 h-4"
                  style={{ color: "oklch(0.65 0.20 30)" }}
                />
              )}
              {trend === "flat" && (
                <Minus className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                data-ocid="weight.open_modal_button"
                variant="outline"
                className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent
              data-ocid="weight.dialog"
              className="bg-card border-border"
            >
              <DialogHeader>
                <DialogTitle className="text-foreground font-display">
                  Log Body Weight
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4 mt-2">
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Weight (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    data-ocid="weight.input"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="75.5"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="weight.submit_button"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Entry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {entries.length === 0 ? (
        <div
          data-ocid="weight.empty_state"
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <span className="text-4xl mb-3">⚖️</span>
          <p className="text-muted-foreground text-sm">
            No weight entries yet.
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Tap Add to log your first entry.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.03 240)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "oklch(0.55 0.05 240)", fontSize: 10 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "oklch(0.55 0.05 240)", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.12 0.03 240)",
                border: "1px solid oklch(0.25 0.05 240)",
                borderRadius: "8px",
                color: "oklch(0.95 0.02 240)",
              }}
              formatter={(val) => [`${val} kg`, "Weight"]}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="oklch(0.65 0.22 240)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.65 0.22 240)", r: 3 }}
              activeDot={{ r: 5, fill: "oklch(0.75 0.22 220)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
