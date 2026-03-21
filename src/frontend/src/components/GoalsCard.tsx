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
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGoals, useSaveGoal } from "../hooks/useQueries";

const MOCK_GOALS = [
  { name: "Weight Loss", unit: "kg", currentValue: 8, targetValue: 12 },
  {
    name: "Daily Steps",
    unit: "steps",
    currentValue: 7340,
    targetValue: 10000,
  },
  {
    name: "Weekly Workouts",
    unit: "sessions",
    currentValue: 4,
    targetValue: 5,
  },
  {
    name: "Protein Intake",
    unit: "g/day",
    currentValue: 142,
    targetValue: 180,
  },
];

const RING_COLORS = [
  "oklch(0.65 0.22 240)",
  "oklch(0.84 0.18 80)",
  "oklch(0.75 0.18 160)",
  "oklch(0.70 0.20 300)",
];

function burstConfetti(x: number, y: number) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const COLORS = [
    "oklch(0.65 0.22 240)",
    "oklch(0.84 0.18 80)",
    "oklch(0.75 0.18 160)",
    "white",
  ];
  const particles = Array.from({ length: 60 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 12,
    vy: Math.random() * -14 - 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 6 + 3,
    gravity: 0.5 + Math.random() * 0.3,
    opacity: 1,
  }));

  let frame = 0;
  const MAX = 80;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity = Math.max(0, 1 - frame / MAX);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    frame++;
    if (frame < MAX) requestAnimationFrame(draw);
    else document.body.removeChild(canvas);
  }
  requestAnimationFrame(draw);
}

interface CircularRingProps {
  pct: number;
  color: string;
  size?: number;
  onComplete?: () => void;
}

function CircularRing({
  pct,
  color,
  size = 72,
  onComplete,
}: CircularRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);
  const hasFired = useRef(false);

  useEffect(() => {
    if (pct >= 100 && !hasFired.current) {
      hasFired.current = true;
      onComplete?.();
    }
  }, [pct, onComplete]);

  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      style={{ flexShrink: 0 }}
      role="img"
      aria-label="Goal progress ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="oklch(0.22 0.03 240)"
        strokeWidth="6"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

export function GoalsCard() {
  const { data: goals } = useGoals();
  const { mutateAsync: saveGoal, isPending } = useSaveGoal();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    unit: "",
    current: "",
    target: "",
  });
  const cardRef = useRef<HTMLDivElement>(null);

  const displayGoals =
    goals && goals.length > 0
      ? goals.map((g) => ({
          name: g.name,
          unit: g.unit,
          currentValue: Number(g.currentValue),
          targetValue: Number(g.targetValue),
        }))
      : MOCK_GOALS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveGoal({
        name: form.name,
        unit: form.unit,
        currentValue: BigInt(Number(form.current)),
        targetValue: BigInt(Number(form.target)),
      });
      toast.success("Goal saved!");
      setOpen(false);
      setForm({ name: "", unit: "", current: "", target: "" });
    } catch {
      toast.error("Failed to save goal");
    }
  };

  function handleGoalComplete(goalName: string) {
    const rect = cardRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    burstConfetti(x, y);
    toast.success(`🎉 Goal completed: ${goalName}!`, { duration: 4000 });
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-ocid="goals.card"
      className="rounded-2xl bg-card border border-border p-6 shadow-card glow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground">
            Goals
          </h3>
          <p className="text-sm text-muted-foreground">
            Progress towards your targets
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              data-ocid="goals.open_modal_button"
              variant="outline"
              className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="goals.dialog"
            className="bg-card border-border"
          >
            <DialogHeader>
              <DialogTitle className="text-foreground font-display">
                New Goal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label className="text-muted-foreground">Goal Name</Label>
                <Input
                  data-ocid="goals.input"
                  className="mt-1 bg-muted border-border text-foreground"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Run 5K"
                  required
                />
              </div>
              <div>
                <Label className="text-muted-foreground">Unit</Label>
                <Input
                  className="mt-1 bg-muted border-border text-foreground"
                  value={form.unit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unit: e.target.value }))
                  }
                  placeholder="kg, steps, sessions..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground">Current Value</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={form.current}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, current: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Target Value</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={form.target}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, target: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                data-ocid="goals.submit_button"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? "Saving..." : "Save Goal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4" data-ocid="goals.list">
        {displayGoals.map((goal, i) => {
          const pct = Math.min(
            Math.round((goal.currentValue / goal.targetValue) * 100),
            100,
          );
          const color = RING_COLORS[i % RING_COLORS.length];
          return (
            <div
              key={goal.name}
              data-ocid={`goals.item.${i + 1}`}
              className="flex items-center gap-4"
            >
              <div className="relative flex items-center justify-center">
                <CircularRing
                  pct={pct}
                  color={color}
                  onComplete={() => handleGoalComplete(goal.name)}
                />
                <span className="absolute text-xs font-bold" style={{ color }}>
                  {pct}%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate block">
                  {goal.name}
                </span>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {goal.currentValue.toLocaleString()} /{" "}
                  {goal.targetValue.toLocaleString()} {goal.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
