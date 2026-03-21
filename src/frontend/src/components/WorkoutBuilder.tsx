import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PRESET_EXERCISES = [
  { name: "Bench Press", icon: "🏋️", group: "Chest" },
  { name: "Squat", icon: "🦵", group: "Legs" },
  { name: "Deadlift", icon: "💀", group: "Back" },
  { name: "Pull-ups", icon: "🔝", group: "Back" },
  { name: "OHP", icon: "👆", group: "Shoulders" },
  { name: "Barbell Row", icon: "🪃", group: "Back" },
  { name: "Lunges", icon: "🦿", group: "Legs" },
  { name: "Plank", icon: "🧱", group: "Core" },
  { name: "Dips", icon: "⬇️", group: "Triceps" },
  { name: "Bicep Curl", icon: "💪", group: "Biceps" },
  { name: "Tricep Extension", icon: "🔧", group: "Triceps" },
  { name: "Leg Press", icon: "🦾", group: "Legs" },
  { name: "Lat Pulldown", icon: "📉", group: "Back" },
  { name: "Romanian Deadlift", icon: "🏗️", group: "Hamstrings" },
  { name: "Cable Fly", icon: "🔀", group: "Chest" },
];

interface ExerciseEntry {
  name: string;
  sets: string;
  reps: string;
}

interface SavedWorkout {
  id: string;
  name: string;
  exercises: ExerciseEntry[];
  createdAt: number;
}

const ACCENT = "oklch(0.65 0.22 240)";
const AMBER = "oklch(0.76 0.16 55)";
const VIOLET = "oklch(0.65 0.22 285)";

function loadSavedWorkouts(): SavedWorkout[] {
  try {
    return JSON.parse(
      localStorage.getItem("fittrack_workouts_builder") ?? "[]",
    );
  } catch {
    return [];
  }
}

export function WorkoutBuilder() {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [savedWorkouts, setSavedWorkouts] =
    useState<SavedWorkout[]>(loadSavedWorkouts);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = Array.from(new Set(PRESET_EXERCISES.map((e) => e.group)));

  const filteredExercises = activeGroup
    ? PRESET_EXERCISES.filter((e) => e.group === activeGroup)
    : PRESET_EXERCISES;

  function addExercise(name: string) {
    if (exercises.some((e) => e.name === name)) {
      toast.error(`${name} already in your workout`);
      return;
    }
    setExercises((prev) => [...prev, { name, sets: "3", reps: "10" }]);
  }

  function removeExercise(name: string) {
    setExercises((prev) => prev.filter((e) => e.name !== name));
  }

  function updateExercise(name: string, field: "sets" | "reps", value: string) {
    setExercises((prev) =>
      prev.map((e) => (e.name === name ? { ...e, [field]: value } : e)),
    );
  }

  function saveWorkout() {
    if (!workoutName.trim()) {
      toast.error("Give your workout a name!");
      return;
    }
    if (exercises.length === 0) {
      toast.error("Add at least one exercise!");
      return;
    }
    const newWorkout: SavedWorkout = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      exercises,
      createdAt: Date.now(),
    };
    const updated = [newWorkout, ...savedWorkouts];
    localStorage.setItem("fittrack_workouts_builder", JSON.stringify(updated));
    setSavedWorkouts(updated);
    toast.success(`"${workoutName}" saved! 💾`);
    setWorkoutName("");
    setExercises([]);
  }

  function loadWorkout(workout: SavedWorkout) {
    setWorkoutName(workout.name);
    setExercises(workout.exercises);
    toast.success(`Loaded "${workout.name}"`);
  }

  function deleteWorkout(id: string) {
    const updated = savedWorkouts.filter((w) => w.id !== id);
    localStorage.setItem("fittrack_workouts_builder", JSON.stringify(updated));
    setSavedWorkouts(updated);
    toast.success("Workout deleted");
  }

  return (
    <main className="mx-auto max-w-[1400px] pb-12 px-6 pt-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🔨</span>
          <h1 className="text-4xl font-display font-bold text-foreground">
            Workout Builder
          </h1>
        </div>
        <p className="text-muted-foreground text-sm ml-12">
          Design your perfect workout. Build. Save. Dominate.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Library */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border p-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.10 0.03 240), oklch(0.09 0.02 260))",
            borderColor: `${ACCENT}30`,
          }}
        >
          <h2 className="text-lg font-display font-bold text-foreground mb-4">
            Exercise Library
          </h2>

          {/* Group filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveGroup(null)}
              className="text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase transition-all"
              style={{
                background: !activeGroup
                  ? ACCENT
                  : "oklch(0.14 0.04 240 / 0.6)",
                color: !activeGroup
                  ? "oklch(0.08 0.005 260)"
                  : "oklch(0.6 0.06 240)",
              }}
            >
              All
            </button>
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGroup(activeGroup === g ? null : g)}
                className="text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase transition-all"
                style={{
                  background:
                    activeGroup === g ? VIOLET : "oklch(0.14 0.04 240 / 0.6)",
                  color:
                    activeGroup === g
                      ? "oklch(0.97 0.01 280)"
                      : "oklch(0.6 0.06 240)",
                }}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredExercises.map((ex) => {
              const isAdded = exercises.some((e) => e.name === ex.name);
              return (
                <button
                  key={ex.name}
                  type="button"
                  onClick={() => addExercise(ex.name)}
                  disabled={isAdded}
                  data-ocid="builder.secondary_button"
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: isAdded
                      ? "oklch(0.65 0.22 240 / 0.15)"
                      : "oklch(0.13 0.03 240 / 0.7)",
                    border: `1px solid ${isAdded ? ACCENT : "oklch(0.18 0.04 240 / 0.5)"}`,
                    opacity: isAdded ? 0.6 : 1,
                    cursor: isAdded ? "default" : "pointer",
                  }}
                >
                  <span className="text-xl">{ex.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {ex.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {ex.group}
                    </p>
                  </div>
                  {isAdded && (
                    <span className="ml-auto text-xs" style={{ color: ACCENT }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Workout Plan */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border p-5 flex flex-col gap-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.11 0.04 265), oklch(0.09 0.03 285))",
            borderColor: `${VIOLET}30`,
          }}
        >
          <h2 className="text-lg font-display font-bold text-foreground">
            Your Workout Plan
          </h2>

          <Input
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Workout name, e.g. Push Day A"
            data-ocid="builder.input"
            className="bg-background/40 border-border text-foreground placeholder:text-muted-foreground"
          />

          <div className="flex-1 min-h-[200px]">
            {exercises.length === 0 ? (
              <div
                data-ocid="builder.empty_state"
                className="flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed"
                style={{ borderColor: `${VIOLET}30` }}
              >
                <span className="text-3xl mb-2">➕</span>
                <p className="text-sm text-muted-foreground">
                  Click exercises from the library to add them
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-2">
                  {exercises.map((ex, i) => (
                    <motion.div
                      key={ex.name}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16, height: 0 }}
                      transition={{ duration: 0.25 }}
                      data-ocid={`builder.item.${i + 1}`}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{
                        background: "oklch(0.13 0.04 265 / 0.7)",
                        border: `1px solid ${VIOLET}20`,
                      }}
                    >
                      <span className="text-sm font-bold text-muted-foreground w-5">
                        {i + 1}.
                      </span>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {ex.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-muted-foreground">
                            Sets
                          </span>
                          <input
                            type="number"
                            value={ex.sets}
                            onChange={(e) =>
                              updateExercise(ex.name, "sets", e.target.value)
                            }
                            className="w-12 text-center text-xs rounded-md py-1 font-bold"
                            style={{
                              background: "oklch(0.08 0.02 265)",
                              color: VIOLET,
                              border: `1px solid ${VIOLET}30`,
                            }}
                          />
                        </div>
                        <span className="text-muted-foreground text-xs">×</span>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] text-muted-foreground">
                            Reps
                          </span>
                          <input
                            type="number"
                            value={ex.reps}
                            onChange={(e) =>
                              updateExercise(ex.name, "reps", e.target.value)
                            }
                            className="w-12 text-center text-xs rounded-md py-1 font-bold"
                            style={{
                              background: "oklch(0.08 0.02 265)",
                              color: AMBER,
                              border: `1px solid ${AMBER}30`,
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(ex.name)}
                        data-ocid="builder.delete_button"
                        className="text-muted-foreground hover:text-red-400 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          <Button
            onClick={saveWorkout}
            data-ocid="builder.submit_button"
            className="w-full font-bold tracking-[0.12em] uppercase"
            style={{
              background: VIOLET,
              color: "oklch(0.97 0.01 280)",
              boxShadow: `0 0 24px ${VIOLET}40`,
            }}
          >
            Save Workout 💾
          </Button>
        </motion.div>
      </div>

      {/* Saved Workouts */}
      {savedWorkouts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-4">
            Saved Workouts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedWorkouts.map((workout, i) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                data-ocid={`builder.saved.item.${i + 1}`}
                className="rounded-xl border p-4 group"
                style={{
                  background: "oklch(0.10 0.03 265 / 0.8)",
                  borderColor: `${VIOLET}25`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {workout.name}
                  </h4>
                  <button
                    type="button"
                    onClick={() => deleteWorkout(workout.id)}
                    data-ocid="builder.delete_button"
                    className="text-muted-foreground hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {workout.exercises.length} exercises
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {workout.exercises.slice(0, 4).map((ex) => (
                    <span
                      key={ex.name}
                      className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: `${VIOLET}20`, color: VIOLET }}
                    >
                      {ex.name}
                    </span>
                  ))}
                  {workout.exercises.length > 4 && (
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: `${VIOLET}20`, color: VIOLET }}
                    >
                      +{workout.exercises.length - 4} more
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => loadWorkout(workout)}
                  data-ocid="builder.secondary_button"
                  className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg w-full transition-all"
                  style={{
                    background: `${VIOLET}20`,
                    color: VIOLET,
                    border: `1px solid ${VIOLET}30`,
                  }}
                >
                  Load Workout
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}
