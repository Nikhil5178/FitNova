import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ChatMessage,
  Goal,
  Meal,
  StepCount,
  UserProfile,
  Workout,
} from "../backend.d";
import { MealType, WorkoutType } from "../backend.d";

export { WorkoutType, MealType };
export type { Workout, Meal, Goal, ChatMessage, StepCount, UserProfile };

// localStorage helpers
function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw, (_k, v) => {
      // Revive bigint values stored as strings with "n" suffix
      if (typeof v === "string" && /^\d+n$/.test(v))
        return BigInt(v.slice(0, -1));
      return v;
    }) as T;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T): void {
  localStorage.setItem(
    key,
    JSON.stringify(value, (_k, v) => {
      if (typeof v === "bigint") return `${v}n`;
      return v;
    }),
  );
}

const now = BigInt(Date.now());
const day = BigInt(86400000);

// Default mock data shown when localStorage is empty
const DEFAULT_WORKOUTS: Workout[] = [
  {
    workoutType: WorkoutType.cardio,
    duration: BigInt(45),
    caloriesBurned: BigInt(380),
    date: now - day,
  },
  {
    workoutType: WorkoutType.strength,
    duration: BigInt(60),
    caloriesBurned: BigInt(420),
    date: now - day * BigInt(2),
  },
  {
    workoutType: WorkoutType.yoga,
    duration: BigInt(30),
    caloriesBurned: BigInt(180),
    date: now - day * BigInt(3),
  },
];

const DEFAULT_MEALS: Meal[] = [
  {
    mealType: MealType.breakfast,
    name: "Oatmeal with berries",
    calories: BigInt(320),
    protein: BigInt(12),
    carbs: BigInt(58),
    fat: BigInt(6),
    date: now - BigInt(3600000),
  },
  {
    mealType: MealType.lunch,
    name: "Grilled chicken salad",
    calories: BigInt(480),
    protein: BigInt(42),
    carbs: BigInt(24),
    fat: BigInt(18),
    date: now - BigInt(14400000),
  },
  {
    mealType: MealType.dinner,
    name: "Salmon with quinoa",
    calories: BigInt(560),
    protein: BigInt(46),
    carbs: BigInt(38),
    fat: BigInt(20),
    date: now - BigInt(28800000),
  },
];

const DEFAULT_GOALS: Goal[] = [
  {
    name: "Lose 5kg",
    unit: "kg",
    targetValue: BigInt(50),
    currentValue: BigInt(21),
  },
  {
    name: "Run 10K",
    unit: "km",
    targetValue: BigInt(100),
    currentValue: BigInt(65),
  },
  {
    name: "100 Push-ups",
    unit: "reps",
    targetValue: BigInt(100),
    currentValue: BigInt(65),
  },
];

const DEFAULT_STEPS: StepCount[] = [
  { date: now - day, steps: BigInt(8432) },
  { date: now - day * BigInt(2), steps: BigInt(10211) },
  { date: now - day * BigInt(3), steps: BigInt(7890) },
];

export function useWorkouts() {
  return useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => {
      const stored = lsGet<Workout[]>("fittrack_workouts", []);
      return stored.length > 0 ? stored : DEFAULT_WORKOUTS;
    },
  });
}

export function useMeals() {
  return useQuery<Meal[]>({
    queryKey: ["meals"],
    queryFn: () => {
      const stored = lsGet<Meal[]>("fittrack_meals", []);
      return stored.length > 0 ? stored : DEFAULT_MEALS;
    },
  });
}

export function useGoals() {
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: () => {
      const stored = lsGet<Goal[]>("fittrack_goals", []);
      return stored.length > 0 ? stored : DEFAULT_GOALS;
    },
  });
}

export function useChatHistory() {
  return useQuery<ChatMessage[]>({
    queryKey: ["chatHistory"],
    queryFn: () => lsGet<ChatMessage[]>("fittrack_chat", []),
  });
}

export function useStepCounts() {
  return useQuery<StepCount[]>({
    queryKey: ["stepCounts"],
    queryFn: () => {
      const stored = lsGet<StepCount[]>("fittrack_steps", []);
      return stored.length > 0 ? stored : DEFAULT_STEPS;
    },
  });
}

export function useUserProfile() {
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: () => lsGet<UserProfile | null>("fittrack_profile", null),
  });
}

export function useLogWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (workout: Workout) => {
      const existing = lsGet<Workout[]>("fittrack_workouts", []);
      const base = existing.length > 0 ? existing : [...DEFAULT_WORKOUTS];
      lsSet("fittrack_workouts", [...base, workout]);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });
}

export function useLogMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (meal: Meal) => {
      const existing = lsGet<Meal[]>("fittrack_meals", []);
      const base = existing.length > 0 ? existing : [...DEFAULT_MEALS];
      lsSet("fittrack_meals", [...base, meal]);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meals"] }),
  });
}

export function useSaveGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Goal) => {
      const existing = lsGet<Goal[]>("fittrack_goals", []);
      const base = existing.length > 0 ? existing : [...DEFAULT_GOALS];
      lsSet("fittrack_goals", [...base, goal]);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useAddChatMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: ChatMessage) => {
      const existing = lsGet<ChatMessage[]>("fittrack_chat", []);
      lsSet("fittrack_chat", [...existing, message]);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatHistory"] }),
  });
}
