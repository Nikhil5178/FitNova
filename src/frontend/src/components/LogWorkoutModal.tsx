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
import { useState } from "react";
import { toast } from "sonner";
import { type WorkoutType, useLogWorkout } from "../hooks/useQueries";

export function LogWorkoutModal() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: logWorkout, isPending } = useLogWorkout();
  const [form, setForm] = useState({
    type: "cardio",
    duration: "",
    calories: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logWorkout({
        workoutType: form.type as WorkoutType,
        duration: BigInt(Number(form.duration)),
        caloriesBurned: BigInt(Number(form.calories)),
        date: BigInt(Date.now() * 1_000_000),
      });
      toast.success("Workout logged! 💪");
      setOpen(false);
      setForm({ type: "cardio", duration: "", calories: "" });
    } catch {
      toast.error("Failed to log workout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-ocid="workout.open_modal_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-glow"
        >
          <Plus className="w-4 h-4" /> Log Workout
        </Button>
      </DialogTrigger>
      <DialogContent
        data-ocid="workout.dialog"
        className="bg-card border-border"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">Log a Workout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="text-muted-foreground">Workout Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
            >
              <SelectTrigger
                data-ocid="workout.select"
                className="mt-1 bg-muted border-border text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground">Duration (minutes)</Label>
            <Input
              data-ocid="workout.input"
              type="number"
              className="mt-1 bg-muted border-border text-foreground"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
              placeholder="45"
              required
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Calories Burned</Label>
            <Input
              type="number"
              className="mt-1 bg-muted border-border text-foreground"
              value={form.calories}
              onChange={(e) =>
                setForm((f) => ({ ...f, calories: e.target.value }))
              }
              placeholder="350"
              required
            />
          </div>
          <Button
            type="submit"
            data-ocid="workout.submit_button"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? "Logging..." : "Log Workout"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
