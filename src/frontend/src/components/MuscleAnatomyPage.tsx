import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Tab = "cardio" | "strength";

const ACCENT = "oklch(0.65 0.22 240)";
const AMBER = "oklch(0.76 0.16 55)";

interface MuscleData {
  name: string;
  description: string;
  cardio: string[];
  strength: string[];
}

const MUSCLES: Record<string, MuscleData> = {
  chest: {
    name: "Chest (Pectoralis Major)",
    description:
      "The pectoralis major is the primary muscle of the chest, responsible for pushing movements, arm crossing, and shoulder rotation. It's divided into upper and lower heads.",
    cardio: [],
    strength: ["Bench Press", "Push-ups", "Cable Flies", "Dips"],
  },
  shoulders: {
    name: "Shoulders (Deltoids)",
    description:
      "The deltoid muscle forms the rounded contour of the shoulder. It consists of anterior, lateral, and posterior heads that enable arm raising and rotation.",
    cardio: [],
    strength: ["Overhead Press", "Lateral Raises", "Arnold Press"],
  },
  biceps: {
    name: "Biceps Brachii",
    description:
      "Located on the front of the upper arm, the biceps is responsible for elbow flexion and forearm supination. A key muscle for pulling and curling movements.",
    cardio: [],
    strength: ["Barbell Curls", "Hammer Curls", "Pull-ups"],
  },
  triceps: {
    name: "Triceps Brachii",
    description:
      "Comprising three heads on the back of the upper arm, the triceps extends the elbow and is crucial for all pushing movements.",
    cardio: [],
    strength: ["Tricep Dips", "Skull Crushers", "Pushdowns"],
  },
  lats: {
    name: "Latissimus Dorsi",
    description:
      "The largest muscle of the back, the lats run from the lower spine to the upper arm. Essential for pulling movements and giving the body its V-shape.",
    cardio: ["Rowing", "Swimming"],
    strength: ["Pull-ups", "Lat Pulldown", "Bent-over Rows"],
  },
  traps: {
    name: "Trapezius",
    description:
      "The trapezius spans the upper back and neck, controlling scapular movement, posture, and shoulder elevation. Critical for heavy compound lifts.",
    cardio: [],
    strength: ["Deadlift", "Shrugs", "Face Pulls"],
  },
  abs: {
    name: "Core / Abdominals",
    description:
      "The rectus abdominis and surrounding core muscles stabilize the spine, transfer power between upper and lower body, and protect internal organs.",
    cardio: ["HIIT", "Rowing", "Jump Rope"],
    strength: ["Deadlift", "Planks", "Cable Crunches"],
  },
  quads: {
    name: "Quadriceps",
    description:
      "Four muscles at the front of the thigh responsible for knee extension and hip flexion. The largest muscle group in the body and primary driver of running and squatting.",
    cardio: ["Running", "Cycling", "Stair Climbing", "Jump Rope"],
    strength: ["Squats", "Leg Press", "Lunges"],
  },
  hamstrings: {
    name: "Hamstrings",
    description:
      "Three muscles at the back of the thigh that flex the knee and extend the hip. Essential for sprinting, jumping, and hip-hinge movements.",
    cardio: ["Running", "Cycling", "Hill Sprints"],
    strength: ["Deadlift", "Leg Curl", "Romanian Deadlift"],
  },
  glutes: {
    name: "Glutes (Gluteus Maximus)",
    description:
      "The largest and most powerful muscle in the body, the glutes drive hip extension, stabilize the pelvis, and are critical for nearly every lower-body movement.",
    cardio: ["Cycling", "Stair Climbing", "Sprint Intervals"],
    strength: ["Squats", "Hip Thrusts", "Deadlift"],
  },
  calves: {
    name: "Calves (Gastrocnemius)",
    description:
      "The calf muscles plantarflex the ankle, propelling you forward during walking, running, and jumping. Often undertrained but vital for athletic performance.",
    cardio: ["Running", "Jump Rope", "HIIT"],
    strength: ["Calf Raises", "Jump Rope"],
  },
};

interface SVGBodyProps {
  selectedMuscle: string | null;
  onSelect: (muscle: string) => void;
}

function MuscleSVG({ selectedMuscle, onSelect }: SVGBodyProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  function fillFor(id: string) {
    if (selectedMuscle === id) return ACCENT;
    if (hovered === id) return `${ACCENT}80`;
    return "rgba(200,210,220,0.18)";
  }

  function glowFor(id: string) {
    if (selectedMuscle === id) return `drop-shadow(0 0 8px ${ACCENT})`;
    if (hovered === id) return `drop-shadow(0 0 5px ${ACCENT}80)`;
    return "none";
  }

  function shapeProps(id: string) {
    return {
      fill: fillFor(id),
      style: {
        filter: glowFor(id),
        cursor: "pointer",
        transition: "fill 0.2s, filter 0.2s",
      },
      onClick: () => onSelect(id),
      onMouseEnter: () => setHovered(id),
      onMouseLeave: () => setHovered(null),
    };
  }

  return (
    <svg
      viewBox="0 0 200 480"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] mx-auto"
      style={{ filter: "drop-shadow(0 0 30px rgba(0,0,0,0.6))" }}
    >
      <title>Human body muscle anatomy diagram</title>
      {/* ---- Body silhouette ---- */}
      {/* Head */}
      <ellipse
        cx="100"
        cy="38"
        rx="26"
        ry="30"
        fill="rgba(180,190,200,0.12)"
        stroke="rgba(180,190,200,0.35)"
        strokeWidth="1.5"
      />
      {/* Neck */}
      <rect
        x="91"
        y="64"
        width="18"
        height="14"
        rx="4"
        fill="rgba(180,190,200,0.10)"
        stroke="rgba(180,190,200,0.25)"
        strokeWidth="1"
      />
      {/* Torso */}
      <path
        d="M62,78 L138,78 L145,200 L55,200 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.25)"
        strokeWidth="1.5"
      />
      {/* Left Upper Arm */}
      <path
        d="M56,82 L38,90 L30,145 L48,148 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Right Upper Arm */}
      <path
        d="M144,82 L162,90 L170,145 L152,148 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Left Forearm */}
      <path
        d="M48,148 L30,148 L26,200 L44,202 Z"
        fill="rgba(180,190,200,0.07)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Right Forearm */}
      <path
        d="M152,148 L170,148 L174,200 L156,202 Z"
        fill="rgba(180,190,200,0.07)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Left Hand */}
      <ellipse
        cx="36"
        cy="210"
        rx="10"
        ry="14"
        fill="rgba(180,190,200,0.07)"
        stroke="rgba(180,190,200,0.18)"
        strokeWidth="1"
      />
      {/* Right Hand */}
      <ellipse
        cx="164"
        cy="210"
        rx="10"
        ry="14"
        fill="rgba(180,190,200,0.07)"
        stroke="rgba(180,190,200,0.18)"
        strokeWidth="1"
      />
      {/* Hips */}
      <path
        d="M55,200 L145,200 L148,240 L52,240 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.22)"
        strokeWidth="1.5"
      />
      {/* Left Upper Leg */}
      <path
        d="M52,240 L90,240 L86,340 L52,338 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Right Upper Leg */}
      <path
        d="M110,240 L148,240 L148,338 L114,340 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Left Knee */}
      <ellipse
        cx="69"
        cy="345"
        rx="18"
        ry="10"
        fill="rgba(180,190,200,0.08)"
        stroke="rgba(180,190,200,0.18)"
        strokeWidth="1"
      />
      {/* Right Knee */}
      <ellipse
        cx="131"
        cy="345"
        rx="18"
        ry="10"
        fill="rgba(180,190,200,0.08)"
        stroke="rgba(180,190,200,0.18)"
        strokeWidth="1"
      />
      {/* Left Lower Leg */}
      <path
        d="M52,352 L86,352 L82,430 L56,430 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Right Lower Leg */}
      <path
        d="M114,352 L148,352 L144,430 L118,430 Z"
        fill="rgba(180,190,200,0.09)"
        stroke="rgba(180,190,200,0.2)"
        strokeWidth="1"
      />
      {/* Feet */}
      <ellipse
        cx="70"
        cy="440"
        rx="20"
        ry="10"
        fill="rgba(180,190,200,0.07)"
        stroke="rgba(180,190,200,0.18)"
        strokeWidth="1"
      />
      <ellipse
        cx="130"
        cy="440"
        rx="20"
        ry="10"
        fill="rgba(180,190,200,0.07)"
        stroke="rgba(180,190,200,0.18)"
        strokeWidth="1"
      />

      {/* ---- Clickable Muscle Groups ---- */}
      {/* Traps */}
      <ellipse
        cx="100"
        cy="80"
        rx="22"
        ry="8"
        {...shapeProps("traps")}
        opacity="0.85"
      />

      {/* Chest - left pec */}
      <ellipse
        cx="83"
        cy="105"
        rx="16"
        ry="14"
        {...shapeProps("chest")}
        opacity="0.85"
      />
      {/* Chest - right pec */}
      <ellipse
        cx="117"
        cy="105"
        rx="16"
        ry="14"
        {...shapeProps("chest")}
        opacity="0.85"
      />

      {/* Shoulders - left */}
      <ellipse
        cx="60"
        cy="90"
        rx="12"
        ry="10"
        {...shapeProps("shoulders")}
        opacity="0.85"
      />
      {/* Shoulders - right */}
      <ellipse
        cx="140"
        cy="90"
        rx="12"
        ry="10"
        {...shapeProps("shoulders")}
        opacity="0.85"
      />

      {/* Biceps - left */}
      <ellipse
        cx="44"
        cy="118"
        rx="9"
        ry="14"
        {...shapeProps("biceps")}
        opacity="0.85"
      />
      {/* Biceps - right */}
      <ellipse
        cx="156"
        cy="118"
        rx="9"
        ry="14"
        {...shapeProps("biceps")}
        opacity="0.85"
      />

      {/* Triceps (sides) - left */}
      <ellipse
        cx="36"
        cy="122"
        rx="6"
        ry="12"
        {...shapeProps("triceps")}
        opacity="0.7"
      />
      {/* Triceps (sides) - right */}
      <ellipse
        cx="164"
        cy="122"
        rx="6"
        ry="12"
        {...shapeProps("triceps")}
        opacity="0.7"
      />

      {/* Lats - left side of torso */}
      <ellipse
        cx="64"
        cy="145"
        rx="10"
        ry="22"
        {...shapeProps("lats")}
        opacity="0.75"
      />
      {/* Lats - right side */}
      <ellipse
        cx="136"
        cy="145"
        rx="10"
        ry="22"
        {...shapeProps("lats")}
        opacity="0.75"
      />

      {/* Abs */}
      <rect
        x="84"
        y="125"
        width="32"
        height="60"
        rx="6"
        {...shapeProps("abs")}
        opacity="0.85"
      />

      {/* Glutes */}
      <ellipse
        cx="82"
        cy="220"
        rx="24"
        ry="16"
        {...shapeProps("glutes")}
        opacity="0.8"
      />
      <ellipse
        cx="118"
        cy="220"
        rx="24"
        ry="16"
        {...shapeProps("glutes")}
        opacity="0.8"
      />

      {/* Quads - left */}
      <ellipse
        cx="71"
        cy="285"
        rx="16"
        ry="42"
        {...shapeProps("quads")}
        opacity="0.85"
      />
      {/* Quads - right */}
      <ellipse
        cx="129"
        cy="285"
        rx="16"
        ry="42"
        {...shapeProps("quads")}
        opacity="0.85"
      />

      {/* Hamstrings (sides) - left */}
      <ellipse
        cx="55"
        cy="285"
        rx="8"
        ry="36"
        {...shapeProps("hamstrings")}
        opacity="0.65"
      />
      {/* Hamstrings - right */}
      <ellipse
        cx="145"
        cy="285"
        rx="8"
        ry="36"
        {...shapeProps("hamstrings")}
        opacity="0.65"
      />

      {/* Calves - left */}
      <ellipse
        cx="69"
        cy="390"
        rx="14"
        ry="32"
        {...shapeProps("calves")}
        opacity="0.85"
      />
      {/* Calves - right */}
      <ellipse
        cx="131"
        cy="390"
        rx="14"
        ry="32"
        {...shapeProps("calves")}
        opacity="0.85"
      />

      {/* Muscle labels (tiny, non-interactive) */}
      <text
        x="100"
        y="77"
        textAnchor="middle"
        fontSize="5"
        fill="rgba(255,255,255,0.35)"
        pointerEvents="none"
      >
        TRAPS
      </text>
      <text
        x="83"
        y="108"
        textAnchor="middle"
        fontSize="5"
        fill="rgba(255,255,255,0.35)"
        pointerEvents="none"
      >
        CHEST
      </text>
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fontSize="5"
        fill="rgba(255,255,255,0.35)"
        pointerEvents="none"
      >
        ABS
      </text>
      <text
        x="71"
        y="288"
        textAnchor="middle"
        fontSize="5"
        fill="rgba(255,255,255,0.35)"
        pointerEvents="none"
      >
        QUADS
      </text>
      <text
        x="69"
        y="393"
        textAnchor="middle"
        fontSize="5"
        fill="rgba(255,255,255,0.35)"
        pointerEvents="none"
      >
        CALVES
      </text>
    </svg>
  );
}

interface Props {
  onBack: () => void;
}

export function MuscleAnatomyPage({ onBack }: Props) {
  const [tab, setTab] = useState<Tab>("strength");
  const [selected, setSelected] = useState<string | null>("chest");

  const muscleData = selected ? MUSCLES[selected] : null;
  const exercises = muscleData
    ? tab === "cardio"
      ? muscleData.cardio
      : muscleData.strength
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/6 px-6 py-4 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          data-ocid="anatomy.back_button"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
        <div className="h-4 w-px bg-white/10" />
        <span
          className="font-display font-bold text-sm tracking-[0.2em] uppercase"
          style={{ color: ACCENT }}
        >
          Muscle Anatomy
        </span>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight uppercase mb-3">
            MUSCLE ANATOMY
          </h1>
          <p
            className="text-sm tracking-[0.25em] uppercase"
            style={{ color: ACCENT }}
          >
            Understand every muscle. Train with purpose.
          </p>
        </motion.div>

        {/* Tab Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-12"
        >
          <div
            className="flex rounded-lg p-1 gap-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {(["cardio", "strength"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                data-ocid={`anatomy.${t}.tab`}
                onClick={() => {
                  setTab(t);
                  setSelected(t === "cardio" ? "quads" : "chest");
                }}
                className="px-8 py-2.5 text-xs font-bold tracking-[0.2em] uppercase rounded transition-all duration-300"
                style={
                  tab === t
                    ? {
                        background: ACCENT,
                        color: "oklch(0.08 0.005 260)",
                        boxShadow: `0 0 16px ${ACCENT}50`,
                      }
                    : { color: "rgba(255,255,255,0.45)" }
                }
              >
                {t === "cardio" ? "CARDIO" : "STRENGTH"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* SVG Body Diagram */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-8 flex flex-col items-center gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Click a muscle to explore
            </p>
            <MuscleSVG selectedMuscle={selected} onSelect={setSelected} />
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {Object.keys(MUSCLES).map((id) => (
                <button
                  key={id}
                  type="button"
                  data-ocid="anatomy.muscle.button"
                  onClick={() => setSelected(id)}
                  className="text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full transition-all duration-200 font-semibold"
                  style={
                    selected === id
                      ? {
                          background: ACCENT,
                          color: "oklch(0.08 0.005 260)",
                          boxShadow: `0 0 10px ${ACCENT}50`,
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.5)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {id === "abs"
                    ? "Core/Abs"
                    : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info Panel */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  data-ocid="anatomy.muscle.empty_state"
                  className="flex flex-col items-center justify-center h-64 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p className="text-muted-foreground text-sm tracking-widest uppercase">
                    Click any muscle to explore exercises
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${selected}-${tab}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl p-8"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  data-ocid="anatomy.muscle.panel"
                >
                  <div
                    className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-4"
                    style={{ background: `${ACCENT}20`, color: ACCENT }}
                  >
                    {tab === "cardio" ? "Cardio" : "Strength"}
                  </div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                    {MUSCLES[selected].name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {MUSCLES[selected].description}
                  </p>

                  <div>
                    <h3
                      className="text-xs font-bold tracking-[0.25em] uppercase mb-4"
                      style={{ color: ACCENT }}
                    >
                      Exercises for this muscle
                    </h3>
                    {exercises.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic tracking-wide">
                        Less activated in {tab} training. Focus on{" "}
                        {tab === "cardio" ? "strength" : "cardio"} for this
                        muscle group.
                      </p>
                    ) : (
                      <motion.div
                        className="flex flex-wrap gap-2"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.07 } },
                        }}
                      >
                        {exercises.map((ex, i) => (
                          <motion.span
                            key={ex}
                            data-ocid={`anatomy.exercise.item.${i + 1}`}
                            variants={{
                              hidden: { opacity: 0, scale: 0.8 },
                              show: {
                                opacity: 1,
                                scale: 1,
                                transition: { duration: 0.3 },
                              },
                            }}
                            className="text-xs font-semibold tracking-wide px-4 py-2 rounded-full"
                            style={{
                              background: `${ACCENT}15`,
                              color: ACCENT,
                              border: `1px solid ${ACCENT}40`,
                            }}
                          >
                            {ex}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Muscle stat bar */}
                  <div className="mt-8 pt-6 border-t border-white/6">
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">
                      Activation Level
                    </p>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            exercises.length === 0
                              ? "15%"
                              : `${Math.min(100, exercises.length * 22 + 20)}%`,
                        }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          background: `linear-gradient(90deg, ${ACCENT}, ${AMBER})`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
