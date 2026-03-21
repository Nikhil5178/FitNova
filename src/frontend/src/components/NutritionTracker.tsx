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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type MealType, useLogMeal, useMeals } from "../hooks/useQueries";

const MOCK_MEALS = [
  {
    name: "Greek Yogurt & Berries",
    mealType: "breakfast",
    calories: 280,
    protein: 22,
    carbs: 34,
    fat: 6,
  },
  {
    name: "Grilled Chicken Salad",
    mealType: "lunch",
    calories: 420,
    protein: 45,
    carbs: 28,
    fat: 12,
  },
  {
    name: "Protein Shake",
    mealType: "snack",
    calories: 180,
    protein: 30,
    carbs: 12,
    fat: 3,
  },
  {
    name: "Salmon & Quinoa",
    mealType: "dinner",
    calories: 580,
    protein: 48,
    carbs: 52,
    fat: 18,
  },
];

const MEAL_COLORS: Record<string, string> = {
  breakfast: "oklch(0.82 0.18 195)",
  lunch: "oklch(0.84 0.19 120)",
  snack: "oklch(0.75 0.18 160)",
  dinner: "oklch(0.70 0.15 220)",
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function NutritionTracker() {
  const { data: meals } = useMeals();
  const { mutateAsync: logMeal, isPending } = useLogMeal();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "lunch",
  });

  const displayMeals =
    meals && meals.length > 0
      ? meals.slice(0, 5).map((m) => ({
          name: m.name,
          mealType: m.mealType,
          calories: Number(m.calories),
          protein: Number(m.protein),
          carbs: Number(m.carbs),
          fat: Number(m.fat),
        }))
      : MOCK_MEALS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logMeal({
        name: form.name,
        calories: BigInt(Number(form.calories)),
        protein: BigInt(Number(form.protein)),
        carbs: BigInt(Number(form.carbs)),
        fat: BigInt(Number(form.fat)),
        mealType: form.mealType as MealType,
        date: BigInt(Date.now() * 1_000_000),
      });
      toast.success("Meal logged!");
      setOpen(false);
      setForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        mealType: "lunch",
      });
    } catch {
      toast.error("Failed to log meal");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      data-ocid="nutrition.card"
      className="rounded-2xl bg-card border border-border p-6 shadow-card glow-card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-display font-bold text-foreground">
            Nutrition Tracker
          </h3>
          <p className="text-sm text-muted-foreground">Today's logged meals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              data-ocid="nutrition.open_modal_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-glow"
            >
              <Plus className="w-4 h-4" /> Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="nutrition.dialog"
            className="bg-card border-border"
          >
            <DialogHeader>
              <DialogTitle className="text-foreground font-display">
                Log a Meal
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label className="text-muted-foreground">Meal Name</Label>
                <Input
                  data-ocid="nutrition.input"
                  className="mt-1 bg-muted border-border text-foreground"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Grilled Chicken"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground">Calories</Label>
                  <Input
                    data-ocid="nutrition.input"
                    type="number"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={form.calories}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, calories: e.target.value }))
                    }
                    placeholder="kcal"
                    required
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Protein (g)</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={form.protein}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, protein: e.target.value }))
                    }
                    placeholder="g"
                    required
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Carbs (g)</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={form.carbs}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, carbs: e.target.value }))
                    }
                    placeholder="g"
                    required
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Fat (g)</Label>
                  <Input
                    type="number"
                    className="mt-1 bg-muted border-border text-foreground"
                    value={form.fat}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fat: e.target.value }))
                    }
                    placeholder="g"
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Meal Type</Label>
                <Select
                  value={form.mealType}
                  onValueChange={(v) => setForm((f) => ({ ...f, mealType: v }))}
                >
                  <SelectTrigger
                    data-ocid="nutrition.select"
                    className="mt-1 bg-muted border-border text-foreground"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                data-ocid="nutrition.submit_button"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? "Logging..." : "Log Meal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-2.5"
        data-ocid="nutrition.list"
      >
        {displayMeals.map((meal, i) => (
          <motion.div
            key={meal.name}
            variants={itemVariants}
            data-ocid={`nutrition.item.${i + 1}`}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/70 border border-transparent hover:border-border transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: MEAL_COLORS[meal.mealType] ?? MEAL_COLORS.lunch,
                  boxShadow: `0 0 6px ${MEAL_COLORS[meal.mealType] ?? MEAL_COLORS.lunch}`,
                }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {meal.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {meal.mealType} · {meal.protein}g protein
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">
              {meal.calories} kcal
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
