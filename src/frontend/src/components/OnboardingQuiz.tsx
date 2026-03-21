import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type Goal =
  | "Lose Weight"
  | "Build Muscle"
  | "Improve Endurance"
  | "Stay Active";
type Level = "Beginner" | "Intermediate" | "Advanced";
type Equipment = "No Equipment" | "Dumbbells" | "Full Gym" | "Home Gym";
type Frequency = "2x/week" | "3x/week" | "4x/week" | "5x+/week";

interface Profile {
  goal: Goal | null;
  level: Level | null;
  equipment: Equipment[];
  frequency: Frequency | null;
}

const GOALS: { label: Goal; icon: string; desc: string }[] = [
  { label: "Lose Weight", icon: "🔥", desc: "Burn fat, feel lighter" },
  { label: "Build Muscle", icon: "💪", desc: "Gain strength and size" },
  { label: "Improve Endurance", icon: "🏃", desc: "Run farther, last longer" },
  { label: "Stay Active", icon: "⚡", desc: "Maintain a healthy lifestyle" },
];

const LEVELS: { label: Level; icon: string; desc: string }[] = [
  { label: "Beginner", icon: "🌱", desc: "Just getting started" },
  { label: "Intermediate", icon: "🎯", desc: "Consistent for 6+ months" },
  { label: "Advanced", icon: "🏆", desc: "Training for years" },
];

const EQUIPMENT: { label: Equipment; icon: string }[] = [
  { label: "No Equipment", icon: "🤸" },
  { label: "Dumbbells", icon: "🏋️" },
  { label: "Full Gym", icon: "🏟️" },
  { label: "Home Gym", icon: "🏠" },
];

const FREQUENCIES: { label: Frequency; icon: string; sub: string }[] = [
  { label: "2x/week", icon: "📅", sub: "Casual pace" },
  { label: "3x/week", icon: "📆", sub: "Balanced routine" },
  { label: "4x/week", icon: "🗓️", sub: "Dedicated athlete" },
  { label: "5x+/week", icon: "🔱", sub: "Elite mode" },
];

export function OnboardingQuiz() {
  const [onboarded, setOnboarded] = useLocalStorage<string>(
    "fittrack_onboarded",
    "",
  );
  const [, setProfile] = useLocalStorage<Profile | null>(
    "fittrack_profile",
    null,
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Profile>({
    goal: null,
    level: null,
    equipment: [],
    frequency: null,
  });

  if (onboarded === "true") return null;

  const TOTAL = 4;
  const progress = (step / TOTAL) * 100;

  function skip() {
    setOnboarded("true");
  }

  function complete() {
    setProfile(answers);
    setOnboarded("true");
  }

  function nextStep() {
    if (step >= TOTAL - 1) {
      complete();
    } else {
      setStep((s) => s + 1);
    }
  }

  const canProceed =
    (step === 0 && answers.goal !== null) ||
    (step === 1 && answers.level !== null) ||
    (step === 2 && answers.equipment.length > 0) ||
    (step === 3 && answers.frequency !== null);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 p-8"
        style={{ background: "oklch(0.11 0.01 240)" }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "oklch(0.65 0.22 240)" }}
            >
              Step {step + 1} of {TOTAL}
            </span>
            <button
              type="button"
              onClick={skip}
              data-ocid="onboarding.close_button"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Skip
            </button>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "oklch(0.65 0.22 240)" }}
              animate={{ width: `${progress + 25}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepWrapper key="step0">
              <StepTitle>What's your main fitness goal?</StepTitle>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {GOALS.map((g) => (
                  <OptionCard
                    key={g.label}
                    icon={g.icon}
                    label={g.label}
                    sub={g.desc}
                    selected={answers.goal === g.label}
                    onClick={() => setAnswers((a) => ({ ...a, goal: g.label }))}
                    ocid={`onboarding.goal.${g.label.toLowerCase().replace(/\s+/g, "_")}.button`}
                  />
                ))}
              </div>
            </StepWrapper>
          )}
          {step === 1 && (
            <StepWrapper key="step1">
              <StepTitle>What's your experience level?</StepTitle>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {LEVELS.map((l) => (
                  <OptionCard
                    key={l.label}
                    icon={l.icon}
                    label={l.label}
                    sub={l.desc}
                    selected={answers.level === l.label}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, level: l.label }))
                    }
                    ocid={`onboarding.level.${l.label.toLowerCase()}.button`}
                  />
                ))}
              </div>
            </StepWrapper>
          )}
          {step === 2 && (
            <StepWrapper key="step2">
              <StepTitle>What equipment do you have?</StepTitle>
              <p className="text-sm text-white/40 mt-1">
                Select all that apply
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {EQUIPMENT.map((eq) => {
                  const selected = answers.equipment.includes(eq.label);
                  return (
                    <OptionCard
                      key={eq.label}
                      icon={eq.icon}
                      label={eq.label}
                      selected={selected}
                      onClick={() =>
                        setAnswers((a) => ({
                          ...a,
                          equipment: selected
                            ? a.equipment.filter((e) => e !== eq.label)
                            : [...a.equipment, eq.label],
                        }))
                      }
                      ocid={`onboarding.equipment.${eq.label.toLowerCase().replace(/\s+/g, "_")}.button`}
                    />
                  );
                })}
              </div>
            </StepWrapper>
          )}
          {step === 3 && (
            <StepWrapper key="step3">
              <StepTitle>How often do you want to work out?</StepTitle>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {FREQUENCIES.map((f) => (
                  <OptionCard
                    key={f.label}
                    icon={f.icon}
                    label={f.label}
                    sub={f.sub}
                    selected={answers.frequency === f.label}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, frequency: f.label }))
                    }
                    ocid={`onboarding.frequency.${f.label.replace("/", "").replace("+", "plus")}.button`}
                  />
                ))}
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>

        {/* Footer buttons */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              data-ocid="onboarding.cancel_button"
              className="flex-1 py-3 rounded-xl border border-white/10 text-sm font-semibold text-white/60 hover:border-white/30 hover:text-white/90 transition-all"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            disabled={!canProceed}
            data-ocid="onboarding.primary_button"
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: canProceed ? "oklch(0.65 0.22 240)" : "transparent",
              border: canProceed ? "none" : "1px solid rgba(255,255,255,0.1)",
              color: canProceed ? "#000" : "rgba(255,255,255,0.3)",
              boxShadow: canProceed
                ? "0 0 24px oklch(0.65 0.22 240 / 0.5)"
                : "none",
            }}
          >
            {step === TOTAL - 1 ? "Start My Journey" : "Continue"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-display font-bold text-white leading-snug">
      {children}
    </h2>
  );
}

function OptionCard({
  icon,
  label,
  sub,
  selected,
  onClick,
  ocid,
}: {
  icon: string;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      data-ocid={ocid}
      className="relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all cursor-pointer"
      style={{
        borderColor: selected
          ? "oklch(0.65 0.22 240)"
          : "rgba(255,255,255,0.08)",
        background: selected
          ? "oklch(0.65 0.22 240 / 0.12)"
          : "rgba(255,255,255,0.03)",
        boxShadow: selected ? "0 0 20px oklch(0.65 0.22 240 / 0.3)" : "none",
      }}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className="text-sm font-semibold leading-tight"
        style={{
          color: selected ? "oklch(0.65 0.22 240)" : "rgba(255,255,255,0.85)",
        }}
      >
        {label}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          {sub}
        </span>
      )}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-black text-xs font-bold"
          style={{ background: "oklch(0.65 0.22 240)" }}
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}
