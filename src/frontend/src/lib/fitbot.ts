// Keyword-based AI fitness chatbot responses
const responses: Record<string, string[]> = {
  workout: [
    "Great question! For effective workouts, aim for 3-5 sessions per week. Mix strength training with cardio for optimal results. Remember to warm up for 5-10 minutes before each session!",
    "A balanced workout routine should include compound movements like squats, deadlifts, and bench press. These engage multiple muscle groups and maximize calorie burn.",
    "Try HIIT (High-Intensity Interval Training) for efficient workouts. 20-30 minutes of HIIT can burn as many calories as 60 minutes of steady-state cardio!",
  ],
  diet: [
    "Nutrition is 70% of your fitness journey! Focus on whole foods: lean proteins, complex carbs, healthy fats, and plenty of vegetables. Avoid processed foods and added sugars.",
    "Try meal prepping on Sundays to stay on track. Prepare 5-6 days of meals to avoid unhealthy food choices during busy weekdays.",
    "The best diet is one you can stick to long-term. Instead of strict restrictions, focus on portion control and making healthier swaps.",
  ],
  calories: [
    "To lose 1 pound per week, you need a 500 calorie daily deficit. To gain muscle, aim for a 200-300 calorie surplus with high protein intake.",
    "Track your calories for at least 2 weeks to understand your eating patterns. Apps like this one can help you stay accountable!",
    "Don't just count calories — count nutrient quality! 200 calories from chicken breast is very different from 200 calories of chips.",
  ],
  protein: [
    "For muscle building, aim for 0.8-1g of protein per pound of bodyweight daily. Good sources: chicken, fish, eggs, Greek yogurt, legumes, and tofu.",
    "Spread your protein intake across 4-5 meals for optimal muscle protein synthesis. Each meal should have at least 20-30g of protein.",
    "Post-workout protein is crucial! Consume 20-40g within 2 hours after training to maximize muscle recovery and growth.",
  ],
  cardio: [
    "Aim for 150 minutes of moderate cardio or 75 minutes of vigorous cardio per week (WHO recommendation). This could be 30 min walks 5 days a week!",
    "Zone 2 cardio (conversational pace) is excellent for fat burning and heart health. Try 3x per week for 30-45 minutes.",
    "Mix cardio types: steady-state for endurance, HIIT for fat loss and fitness. Don't neglect LISS (Low Intensity Steady State) — it aids recovery.",
  ],
  sleep: [
    "Sleep is your secret weapon! 7-9 hours of quality sleep boosts recovery, muscle growth, and fat loss hormones like growth hormone.",
    "Poor sleep increases cortisol (stress hormone) which promotes fat storage and muscle breakdown. Prioritize your sleep as much as your workouts!",
    "Create a sleep routine: consistent bedtime, dark/cool room, no screens 1 hour before bed, limit caffeine after 2 PM.",
  ],
  weight: [
    "Sustainable weight loss is 0.5-1kg per week. Faster loss risks muscle loss and metabolic slowdown. Slow and steady wins the race!",
    "Weight fluctuates 1-3kg daily due to water, food, and hormones. Track trends over weeks, not daily. Use monthly averages for progress.",
    "Focus on body composition, not just weight. Building muscle while losing fat might keep weight the same but dramatically change your physique!",
  ],
  motivation: [
    "Motivation gets you started, but habits keep you going. Build small, consistent routines that become automatic. Start with just 15 minutes a day!",
    "Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound. 'I will exercise 3x per week for 30 minutes' beats 'I want to get fit'.",
    "Track your progress! Seeing improvements in strength, endurance, or body measurements is incredibly motivating. That's what FitTrack is here for! 💪",
  ],
  rest: [
    "Rest days are NOT lazy days — they're when muscles actually grow! Take 1-2 rest days per week. Active recovery (yoga, light walks) is great on rest days.",
    "Overtraining leads to injury, burnout, and plateaus. Signs include persistent fatigue, declining performance, and mood changes. Listen to your body!",
    "Quality sleep + rest days + proper nutrition = faster results. Recovery is the third pillar of fitness alongside training and nutrition.",
  ],
  stretching: [
    "Dynamic stretching before workouts (leg swings, arm circles) warms up muscles. Static stretching after workouts improves flexibility and reduces soreness.",
    "Foam rolling 10-15 minutes post-workout reduces muscle soreness by 30-40%. Focus on tight spots like hip flexors, IT band, and upper back.",
    "Yoga 2-3x per week improves flexibility, balance, and mental focus. Even 10 minutes of morning stretching can dramatically improve your performance!",
  ],
};

const defaultResponses = [
  "Great question! I'm here to help with your fitness journey. Ask me about workouts, diet, calories, protein, cardio, sleep, weight loss, motivation, rest days, or stretching!",
  "I can give you personalized fitness advice! Try asking me about specific topics like 'How should I structure my workout?' or 'What should I eat for protein?'",
  "Your fitness goals are within reach! Share what you're working on — whether it's building muscle, losing weight, or improving endurance — and I'll guide you.",
];

export function generateFitbotResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [keyword, replies] of Object.entries(responses)) {
    if (lower.includes(keyword)) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export const suggestionChips = [
  "Best workout for beginners?",
  "How much protein do I need?",
  "Tips for weight loss",
  "Cardio vs strength training",
  "How to stay motivated?",
  "How many rest days?",
];
