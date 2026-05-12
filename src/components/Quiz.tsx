import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, RotateCcw, Trophy, Sparkles } from "lucide-react";
import { QUESTIONS_BY_PATH, LEARNING_PATHS } from "../constants";
import { PathId, Question } from "../types";

const SESSION_SIZES: Record<PathId, number> = {
  basics: 10,
  wallet: 10,
  stablecoins: 12,
  testnet: 12,
  building: 15,
  deploying: 15
};

export default function Quiz({ 
  pathId, 
  onAnswerQuestion, 
  onCompletePath 
}: { 
  pathId: PathId;
  onAnswerQuestion: (isCorrect: boolean) => void;
  onCompletePath: () => void;
}) {
  const currentPath = LEARNING_PATHS.find(p => p.id === pathId);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const rotateSeenQuestions = useCallback(() => {
    const trackingKey = `arc_quest_tracking_${pathId}`;
    const rawTracking = localStorage.getItem(trackingKey);
    if (!rawTracking) return;
    const tracking = JSON.parse(rawTracking);
    const newOld = Array.from(new Set([...(tracking.seen_old || []), ...(tracking.seen_recent || [])]));
    localStorage.setItem(trackingKey, JSON.stringify({ seen_old: newOld, seen_recent: tracking.seen_recent || [] }));
  }, [pathId]);

  const shuffleAndSelectQuestions = useCallback(() => {
    const fullPool = QUESTIONS_BY_PATH[pathId] || [];
    if (fullPool.length === 0) return [];
    const sessionSize = SESSION_SIZES[pathId] || 10;
    const trackingKey = `arc_quest_tracking_${pathId}`;
    const rawTracking = localStorage.getItem(trackingKey);
    let tracking = rawTracking ? JSON.parse(rawTracking) : { seen_old: [], seen_recent: [] };
    const seenOldIds = new Set<number>(tracking.seen_old || []);
    const seenRecentIds = new Set<number>(tracking.seen_recent || []);
    const unseenPool = fullPool.filter(q => !seenOldIds.has(q.id) && !seenRecentIds.has(q.id));
    const oldPool = fullPool.filter(q => seenOldIds.has(q.id));
    const recentPool = fullPool.filter(q => seenRecentIds.has(q.id));
    const shuffledUnseen = [...unseenPool].sort(() => Math.random() - 0.5);
    const shuffledOld = [...oldPool].sort(() => Math.random() - 0.5);
    const shuffledRecent = [...recentPool].sort(() => Math.random() - 0.5);
    let selection: Question[] = [...shuffledUnseen.slice(0, sessionSize)];
    if (selection.length < sessionSize) {
      selection = [...selection, ...shuffledOld.slice(0, sessionSize - selection.length)];
    }
    if (selection.length < sessionSize) {
      const needed = sessionSize - selection.length;
      const cap = (unseenPool.length + oldPool.length) >= sessionSize ? 3 : needed;
      selection = [...selection, ...shuffledRecent.slice(0, Math.min(needed, cap, shuffledRecent.length))];
    }
    if (selection.length < sessionSize && selection.length < fullPool.length) {
      const selectedIds = new Set(selection.map(q => q.id));
      const remaining = fullPool.filter(q => !selectedIds.has(q.id)).sort(() => Math.random() - 0.5);
      selection = [...selection, ...remaining.slice(0, sessionSize - selection.length)];
    }
    const finalized = selection.sort(() => Math.random() - 0.5);
    localStorage.setItem(trackingKey, JSON.stringify({ seen_old: tracking.seen_old || [], seen_recent: finalized.map(q => q.id) }));
    return finalized.map(q => ({ ...q, options: [...q.options].sort(() => Math.random() - 0.5) }));
  }, [pathId]);

  useEffect(() => {
    const selected = shuffleAndSelectQuestions();
    setQuestions(selected);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  }, [pathId, shuffleAndSelectQuestions]);

  const handleOptionClick = (option: string) => {
    if (isAnswered || questions.length === 0) return;
    const isCorrect = option === questions[currentQuestionIdx].correctAnswer;
    setSelectedOption(option);
    setIsAnswered(true);
    onAnswerQuestion(isCorrect);
    if (isCorrect) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      rotateSeenQuestions();
      setShowResult(true);
      onCompletePath();
    }
  };

  const resetQuiz = () => {
    rotateSeenQuestions();
    const selected = shuffleAndSelectQuestions();
    setQuestions(selected);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="bg-[#161B22] border border-gray-800 rounded-[2rem] p-12 shadow-2xl">
          <div className="w-16 h-16 bg-arc-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-8 h-8 text-arc-accent animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Questions are loading, please try again in a moment.</h3>
          <p className="text-gray-500">The quest pool is being synchronized for your level.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

  return (
    <section id="quiz" className="py-24 px-4 bg-arc-bg scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#161B22] border border-gray-800 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-arc-accent/5 blur-[80px] rounded-full" />
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`${pathId}-${currentQuestionIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="px-3 py-1 bg-cyan-500/10 text-arc-accent text-[10px] font-bold rounded-full uppercase tracking-wider w-fit">
                      {currentPath?.title} Quest
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest pl-1">
                      Module {currentQuestionIdx + 1}/{questions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-32 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-arc-accent" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">{Math.round(progress)}%</span>
                  </div>
                </div>

                <div className="mb-10 min-h-[100px]">
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">{currentQuestion.text}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-10">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = selectedOption === option;
                    const label = String.fromCharCode(65 + idx);
                    let style = "border-gray-800 bg-gray-900/50 hover:border-gray-600";
                    let iconBg = "bg-gray-800";
                    if (isAnswered) {
                      if (isCorrect) { style = "border-green-500 bg-green-500/10 text-green-400"; iconBg = "bg-green-500 text-white"; }
                      else if (isSelected) { style = "border-red-500 bg-red-500/10 text-red-400"; iconBg = "bg-red-500 text-white"; }
                      else { style = "border-gray-800 bg-gray-900/30 opacity-50"; }
                    }
                    return (
                      <button key={idx} disabled={isAnswered} onClick={() => handleOptionClick(option)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${style}`}>
                        <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${iconBg}`}>{label}</span>
                        <span className="text-sm md:text-base font-medium">{option}</span>
                        {isAnswered && isCorrect && <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-800 gap-6">
                  <div className="flex items-center gap-2 text-arc-accent">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Earn +{currentPath?.xp} XP for completion</span>
                  </div>
                  <button disabled={!isAnswered} onClick={handleNext}
                    className="w-full sm:w-auto px-10 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-arc-accent transition-all shadow-[0_4px_15px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50">
                    {currentQuestionIdx < questions.length - 1 ? "Next Question" : "Finish Quest"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-arc-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-arc-accent" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Quest Completed!</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                  You've mastered the <span className="text-white font-bold">{currentPath?.title}</span> module. Mastery achieved: {score}/{questions.length} correct.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
                  <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">XP Earned</div>
                    <div className="text-3xl font-bold text-arc-accent">+{currentPath?.xp}</div>
                  </div>
                  <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Accuracy</div>
                    <div className="text-3xl font-bold text-white">{Math.round((score / questions.length) * 100)}%</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={resetQuiz} className="w-full sm:w-auto px-8 py-3 bg-[#161B22] text-white font-bold rounded-xl border border-gray-800 hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Restart Quest
                  </button>
                  <a href="#paths" className="w-full sm:w-auto px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-arc-accent transition-all flex items-center justify-center gap-2">
                    Next Challenge <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
                  }
