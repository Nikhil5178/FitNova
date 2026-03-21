import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const RECIPES = [
  {
    name: "Protein Pancakes",
    emoji: "🥞",
    prepTime: "10 min",
    difficulty: "Easy",
    calories: 340,
    protein: 32,
    carbs: 28,
    fat: 8,
    ingredients: [
      "1 scoop whey protein",
      "1 banana",
      "2 eggs",
      "Pinch of cinnamon",
      "Coconut oil for cooking",
    ],
  },
  {
    name: "Avocado Tuna Bowl",
    emoji: "🥑",
    prepTime: "8 min",
    difficulty: "Easy",
    calories: 420,
    protein: 38,
    carbs: 18,
    fat: 22,
    ingredients: [
      "1 can tuna",
      "1 avocado",
      "Cherry tomatoes",
      "Lemon juice",
      "Red onion",
      "Olive oil",
    ],
  },
  {
    name: "Overnight Oats",
    emoji: "🥣",
    prepTime: "5 min",
    difficulty: "Easy",
    calories: 380,
    protein: 24,
    carbs: 52,
    fat: 9,
    ingredients: [
      "80g rolled oats",
      "250ml almond milk",
      "1 scoop protein",
      "Chia seeds",
      "Mixed berries",
    ],
  },
  {
    name: "Chicken Stir-fry",
    emoji: "🍗",
    prepTime: "20 min",
    difficulty: "Medium",
    calories: 510,
    protein: 48,
    carbs: 34,
    fat: 14,
    ingredients: [
      "200g chicken breast",
      "Broccoli florets",
      "Bell peppers",
      "Soy sauce",
      "Ginger",
      "Garlic",
    ],
  },
  {
    name: "Greek Yogurt Parfait",
    emoji: "🍨",
    prepTime: "5 min",
    difficulty: "Easy",
    calories: 290,
    protein: 26,
    carbs: 32,
    fat: 6,
    ingredients: [
      "200g Greek yogurt",
      "Granola",
      "Honey",
      "Mixed berries",
      "Flax seeds",
    ],
  },
  {
    name: "Egg White Omelette",
    emoji: "🍳",
    prepTime: "12 min",
    difficulty: "Medium",
    calories: 220,
    protein: 36,
    carbs: 4,
    fat: 6,
    ingredients: [
      "6 egg whites",
      "Spinach",
      "Cherry tomatoes",
      "Feta cheese",
      "Herbs",
    ],
  },
];

const DIFF_COLOR: Record<string, string> = {
  Easy: "oklch(0.72 0.17 160)",
  Medium: "oklch(0.76 0.16 55)",
  Hard: "oklch(0.65 0.22 25)",
};

const ACCENT = "oklch(0.65 0.22 240)";

export function RecipeCards() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">🍽️</span>
        <div>
          <h3 className="text-xl font-display font-bold text-foreground">
            Recipe Cards
          </h3>
          <p className="text-sm text-muted-foreground">
            High-protein meals to fuel your training
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RECIPES.map((recipe, i) => (
          <motion.div
            key={recipe.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            data-ocid={`recipe.item.${i + 1}`}
          >
            <button
              type="button"
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full text-left rounded-2xl border overflow-hidden transition-all duration-300"
              style={{
                background:
                  expanded === i
                    ? "linear-gradient(135deg, oklch(0.12 0.04 240), oklch(0.10 0.03 265))"
                    : "oklch(0.10 0.03 240 / 0.8)",
                borderColor:
                  expanded === i ? `${ACCENT}50` : "oklch(0.18 0.04 240 / 0.6)",
                boxShadow: expanded === i ? `0 0 20px ${ACCENT}20` : "none",
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{recipe.emoji}</span>
                    <div>
                      <h4 className="text-sm font-display font-bold text-foreground">
                        {recipe.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          ⏱ {recipe.prepTime}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{
                            background: `${DIFF_COLOR[recipe.difficulty] ?? ACCENT}20`,
                            color: DIFF_COLOR[recipe.difficulty] ?? ACCENT,
                          }}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: expanded === i ? 180 : 0 }}
                    className="text-muted-foreground text-xs mt-1"
                  >
                    ▼
                  </motion.span>
                </div>

                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: `${ACCENT}25` }}
                      >
                        {/* Macros */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {[
                            {
                              label: "Cal",
                              value: recipe.calories,
                              color: ACCENT,
                            },
                            {
                              label: "Protein",
                              value: `${recipe.protein}g`,
                              color: "oklch(0.72 0.17 160)",
                            },
                            {
                              label: "Carbs",
                              value: `${recipe.carbs}g`,
                              color: "oklch(0.76 0.16 55)",
                            },
                            {
                              label: "Fat",
                              value: `${recipe.fat}g`,
                              color: "oklch(0.70 0.15 30)",
                            },
                          ].map((macro) => (
                            <div key={macro.label} className="text-center">
                              <div
                                className="text-sm font-bold"
                                style={{ color: macro.color }}
                              >
                                {macro.value}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {macro.label}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Ingredients */}
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2 tracking-[0.1em] uppercase">
                            Ingredients
                          </p>
                          <ul className="space-y-1">
                            {recipe.ingredients.map((ing) => (
                              <li
                                key={ing}
                                className="text-xs text-muted-foreground flex items-center gap-2"
                              >
                                <span
                                  className="w-1 h-1 rounded-full flex-shrink-0"
                                  style={{ background: ACCENT }}
                                />
                                {ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
