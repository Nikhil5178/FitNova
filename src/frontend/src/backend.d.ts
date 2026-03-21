import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Meal {
    fat: bigint;
    carbs: bigint;
    date: bigint;
    calories: bigint;
    name: string;
    mealType: MealType;
    protein: bigint;
}
export interface Goal {
    name: string;
    unit: string;
    currentValue: bigint;
    targetValue: bigint;
}
export interface ChatMessage {
    content: string;
    role: string;
}
export interface Workout {
    duration: bigint;
    date: bigint;
    caloriesBurned: bigint;
    workoutType: WorkoutType;
}
export interface UserProfile {
    age: bigint;
    weight: bigint;
    height: bigint;
    fitnessGoals: Array<Goal>;
    name: string;
}
export interface StepCount {
    date: bigint;
    steps: bigint;
}
export enum MealType {
    breakfast = "breakfast",
    lunch = "lunch",
    snack = "snack",
    dinner = "dinner"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WorkoutType {
    other = "other",
    yoga = "yoga",
    strength = "strength",
    cardio = "cardio"
}
export interface backendInterface {
    addChatMessage(message: ChatMessage): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getGoals(): Promise<Array<Goal>>;
    getMeals(): Promise<Array<Meal>>;
    getStepCounts(): Promise<Array<StepCount>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkouts(): Promise<Array<Workout>>;
    isCallerAdmin(): Promise<boolean>;
    logMeal(meal: Meal): Promise<void>;
    logStepCount(stepCount: StepCount): Promise<void>;
    logWorkout(workout: Workout): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveGoal(goal: Goal): Promise<void>;
}
