import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import LearningPaths from "./components/LearningPaths";
import Quiz from "./components/Quiz";
import Progress from "./components/Progress";
import BuildIdeas from "./components/BuildIdeas";
import Toolkit from "./components/Toolkit";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";
import UsernameModal from "./components/UsernameModal";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { PathId } from "./types";
import { supabase } from "./lib/supabase";

const XP_VALUES: Record<PathId, number> = {
  basics: 250,
  wallet: 200,
  stablecoins: 300,
  testnet: 500,
  building: 750,
  deploying: 1000
};

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<PathId>("basics");
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedPaths, setCompletedPaths] = useState<Set<PathId>>(new Set());
  const [startedPaths, setStartedPaths] = useState<Set<PathId>>(new Set());
  const [badgesCount, setBadgesCount] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const syncUserData = async (name: string) => {
    setIsDataLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', name)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTotalXp(data.xp || 0);
        setStreak(data.streak || 1);
        setBadgesCount(data.badges || 0);
        setAnsweredCount(data.questions_answered || 0);
        if (data.badges_earned) {
          setCompletedPaths(new Set(data.badges_earned as PathId[]));
        }
      } else {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            username: name,
            xp: 0,
            streak: 1,
            badges: 0,
            quests_completed: 0,
            questions_answered: 0,
            last_active: new Date().toISOString(),
            badges_earned: []
          }]);
        if (insertError) throw insertError;
        setStreak(1);
      }
    } catch (err) {
      console.error("Supabase sync failed, using local fallback", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const discordName = session.user.user_metadata.full_name || session.user.user_metadata.name;
          const discordAvatar = session.user.user_metadata.avatar_url;

          if (discordName) {
            setUsername(discordName);
            setAvatarUrl(discordAvatar);
            localStorage.setItem("arc_username", discordName);
            await syncUserData(discordName);
          }
        } else {
          const savedUsername = localStorage.getItem("arc_username");
          if (savedUsername) {
            setUsername(savedUsername);
            await syncUserData(savedUsername);
          }
        }
      } finally {
        setIsAuthChecking(false);
      }
    };

    handleAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const discordName = session.user.user_metadata.full_name || session.user.user_metadata.name;
        const discordAvatar = session.user.user_metadata.avatar_url;

        if (discordName) {
          setUsername(discordName);
          setAvatarUrl(discordAvatar);
          localStorage.setItem("arc_username", discordName);
          syncUserData(discordName);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("arc_user_stats");
    if (saved && !username) {
      const stats = JSON.parse(saved);
      setTotalXp(stats.totalXp || 0);
      setCorrectCount(stats.correctCount || 0);
      setAnsweredCount(stats.answeredCount || 0);
      setStreak(stats.streak || 0);
      if (stats.completedPaths) setCompletedPaths(new Set(stats.completedPaths));
      if (stats.startedPaths) setStartedPaths(new Set(stats.startedPaths));
    }
  }, [username]);

  useEffect(() => {
    if (!username) return;
    const stats = {
      totalXp,
      correctCount,
      answeredCount,
      completedPaths: Array.from(completedPaths),
      startedPaths: Array.from(startedPaths),
      streak,
      lastDate: new Date().toDateString()
    };
    localStorage.setItem("arc_user_stats", JSON.stringify(stats));
  }, [totalXp, correctCount, answeredCount, completedPaths, startedPaths, streak, username]);

  const handleSelectPath = (id: PathId) => {
    setSelectedPathId(id);
    const quizSection = document.getElementById("quiz");
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const updateStreak = async () => {
    const today = new Date().toDateString();
    const lastDateLocal = localStorage.getItem("arc_last_date");

    if (lastDateLocal === today) return;

    let newStreak = streak;
    if (lastDateLocal) {
      const last = new Date(lastDateLocal);
      const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);
    localStorage.setItem("arc_last_date", today);

    if (username) {
      try {
        await supabase
          .from('users')
          .update({ streak: newStreak, last_active: new Date().toISOString() })
          .eq('username', username);
      } catch (e) {
        console.error("Failed to update streak in Supabase", e);
      }
    }
  };

  const handleAnswerQuestion = async (pathId: PathId, isCorrect: boolean) => {
    const newCount = answeredCount + 1;
    setAnsweredCount(newCount);

    if (!completedPaths.has(pathId)) {
      setStartedPaths(prev => {
        const next = new Set(prev);
        next.add(pathId);
        return next;
      });
    }

    updateStreak();

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    if (username) {
      try {
        await supabase
          .from('users')
          .update({ questions_answered: newCount })
          .eq('username', username);
      } catch (e) {
        console.error("Failed to update questions_answered in Supabase", e);
      }
    }
  };

  const handleCompletePath = async (id: PathId) => {
    if (completedPaths.has(id)) return;

    const newCompleted = new Set(completedPaths);
    newCompleted.add(id);
    setCompletedPaths(newCompleted);

    const newStarted = new Set(startedPaths);
    newStarted.delete(id);
    setStartedPaths(newStarted);

    const earnedXp = XP_VALUES[id];
    const newTotalXp = totalXp + earnedXp;
    setTotalXp(newTotalXp);

    const newBadgesCount = badgesCount + 1;
    setBadgesCount(newBadgesCount);

    if (username) {
      try {
        await supabase
          .from('users')
          .update({
            xp: newTotalXp,
            badges: newBadgesCount,
            quests_completed: newCompleted.size,
            badges_earned: Array.from(newCompleted)
          })
          .eq('username', username);
      } catch (e) {
        console.error("Failed to update topic completion in Supabase", e);
      }
    }
  };

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    localStorage.setItem("arc_username", name);
    syncUserData(name);
  };

  const handleLogout = async () => {
    localStorage.removeItem("arc_username");
    localStorage.removeItem("arc_user_stats");
    localStorage.removeItem("arc_last_date");
    await supabase.auth.signOut();

    setUsername("");
    setAvatarUrl(null);
    setTotalXp(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setStreak(0);
    setCompletedPaths(new Set());
    setStartedPaths(new Set());
    setBadgesCount(0);
  };

  return (
    <div className="min-h-screen bg-arc-bg text-gray-100 flex flex-col overflow-x-hidden">
      <AnimatePresence>
        {!isAuthChecking && !username && (
          <UsernameModal onComplete={handleUsernameSubmit} />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 arc-gradient origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-50px] left-[100px] w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <Navbar username={username || "BlockBuilder"} avatarUrl={avatarUrl} onLogout={handleLogout} />

      <main className="relative z-10 flex-grow">
        <Hero
          answeredCount={answeredCount}
          completedCount={completedPaths.size}
          completedPathIds={completedPaths}
          isLoading={isDataLoading}
        />
        <Features />
        <div className="relative">
          <LearningPaths
            onSelectPath={handleSelectPath}
            selectedPathId={selectedPathId}
            completedPaths={completedPaths}
            startedPaths={startedPaths}
          />
          <Quiz
            pathId={selectedPathId}
            onAnswerQuestion={(isCorrect) => handleAnswerQuestion(selectedPathId, isCorrect)}
            onCompletePath={() => handleCompletePath(selectedPathId)}
          />
          <Progress
            xp={totalXp}
            streak={streak}
            correctCount={correctCount}
            totalQuestions={60}
            completedPathIds={completedPaths}
            isLoading={isDataLoading}
          />
        </div>
        <BuildIdeas />
        <Toolkit />
        <Leaderboard currentUsername={username} />
      </main>

      <Footer />
    </div>
  );
          }
