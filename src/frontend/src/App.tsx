import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AIChatbot } from "./components/AIChatbot";
import { AchievementsPanel } from "./components/AchievementsPanel";
import { BodyWeightTracker } from "./components/BodyWeightTracker";
import { CardioPage } from "./components/CardioPage";
import { CardioSection } from "./components/CardioSection";
import { ChallengeOfWeek } from "./components/ChallengeOfWeek";
import { Footer } from "./components/Footer";
import { GoalsCard } from "./components/GoalsCard";
import { HeroSection } from "./components/HeroSection";
import { KPICards } from "./components/KPICards";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { LeftSidebar } from "./components/LeftSidebar";
import { LogWorkoutModal } from "./components/LogWorkoutModal";
import { MuscleAnatomyPage } from "./components/MuscleAnatomyPage";
import { Navbar } from "./components/Navbar";
import { NutritionTracker } from "./components/NutritionTracker";
import { OnboardingQuiz } from "./components/OnboardingQuiz";
import { PricingSection } from "./components/PricingSection";
import { RecentActivity } from "./components/RecentActivity";
import { RecipeCards } from "./components/RecipeCards";
import { StreakCalendar } from "./components/StreakCalendar";
import { StrengthPage } from "./components/StrengthPage";
import { StrengthSection } from "./components/StrengthSection";
import { WaterTracker } from "./components/WaterTracker";
import { WeeklyProgress } from "./components/WeeklyProgress";
import { WeeklySummaryCard } from "./components/WeeklySummaryCard";
import { WorkoutBuilder } from "./components/WorkoutBuilder";
import { XPLevelBar } from "./components/XPLevelBar";

const queryClient = new QueryClient();

type Page = "dashboard" | "anatomy" | "cardio" | "strength" | "workoutBuilder";

function Dashboard() {
  return (
    <main className="mx-auto max-w-[1400px] pb-6" id="dashboard">
      <HeroSection />

      <div className="px-6 mt-12 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold text-foreground">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your fitness overview for today
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <LogWorkoutModal />
        </motion.div>
      </div>

      {/* KPI Cards */}
      <section className="px-6 mt-6" id="workouts">
        <KPICards />
      </section>

      {/* XP Level Bar */}
      <section className="px-6 mt-4" id="xp">
        <XPLevelBar />
      </section>

      <CardioSection />
      <StrengthSection />

      {/* Weekly Progress + Nutrition */}
      <section
        className="px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4"
        id="nutrition"
      >
        <div className="lg:col-span-1">
          <WeeklyProgress />
        </div>
        <div className="lg:col-span-1">
          <NutritionTracker />
        </div>
      </section>

      {/* Recipe Cards */}
      <section className="px-6 mt-6" id="recipes">
        <RecipeCards />
      </section>

      {/* Streak Calendar */}
      <section className="px-6 mt-6" id="streak">
        <StreakCalendar />
      </section>

      {/* Water + Body Weight Trackers */}
      <section
        className="px-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        id="trackers"
      >
        <WaterTracker />
        <BodyWeightTracker />
      </section>

      {/* Activity + Goals */}
      <section
        className="px-6 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-4"
        id="activity"
      >
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2" id="goals">
          <GoalsCard />
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="px-6 mt-6" id="weekly-summary">
        <WeeklySummaryCard />
      </section>

      {/* Challenge of the Week */}
      <section className="px-6 mt-6" id="challenge">
        <ChallengeOfWeek />
      </section>

      {/* Achievements */}
      <section className="px-6 mt-6" id="achievements">
        <AchievementsPanel />
      </section>

      {/* Leaderboard */}
      <section className="px-6 mt-6" id="leaderboard">
        <LeaderboardSection />
      </section>

      <PricingSection />
    </main>
  );
}

function PageLayout({
  page,
  children,
}: { page: Page; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <LeftSidebar currentPage={page} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
      <Toaster />
      <AIChatbot />
      <OnboardingQuiz />
    </div>
  );
}

function AppInner() {
  const [page, setPage] = useState<Page>("dashboard");

  useEffect(() => {
    function handleNav(e: Event) {
      const detail = (e as CustomEvent<string>).detail as Page;
      if (
        [
          "dashboard",
          "anatomy",
          "cardio",
          "strength",
          "workoutBuilder",
        ].includes(detail)
      ) {
        setPage(detail as Page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    window.addEventListener("fittrack:navigate", handleNav);
    return () => window.removeEventListener("fittrack:navigate", handleNav);
  }, []);

  if (page === "anatomy") {
    return (
      <PageLayout page={page}>
        <MuscleAnatomyPage onBack={() => setPage("dashboard")} />
      </PageLayout>
    );
  }

  if (page === "cardio") {
    return (
      <PageLayout page={page}>
        <CardioPage />
      </PageLayout>
    );
  }

  if (page === "strength") {
    return (
      <PageLayout page={page}>
        <StrengthPage />
      </PageLayout>
    );
  }

  if (page === "workoutBuilder") {
    return (
      <PageLayout page={page}>
        <WorkoutBuilder />
      </PageLayout>
    );
  }

  return (
    <PageLayout page={page}>
      <Dashboard />
    </PageLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
