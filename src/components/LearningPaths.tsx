import { useState } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { LEARNING_PATHS } from "../constants";
import { PathId } from "../types";

const PathCard = ({ path, delay, onClick, isActive, isCompleted }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
        isActive ? "bg-cyan-500/10 border-cyan-500/50 scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.1)]" : 
        isCompleted ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40" :
        "bg-gray-900/40 border-gray-800 hover:border-gray-600"
      }`}
    >
      {isCompleted && (
        <div className="absolute top-0 right-0 p-2">
          <LucideIcons.CheckCircle2 className="w-4 h-4 text-green-500" />
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-xs font-bold transition-colors ${
            isActive ? "text-arc-accent" : 
            isCompleted ? "text-green-400" :
            "text-white group-hover:text-arc-accent"
          }`}>{path.title}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{path.difficulty} • {path.time}</p>
        </div>
        {isCompleted ? (
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] text-green-500 font-bold">✓</div>
        ) : isActive ? (
          <div className="w-2 h-2 rounded-full bg-arc-accent animate-pulse"></div>
        ) : (
          <LucideIcons.ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
        )}
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800/50">
        <div className="flex items-center gap-1 text-arc-accent font-bold text-[10px]">
          <LucideIcons.Zap className="w-3 h-3" />
          {path.xp} XP
        </div>
        <button className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
          isActive ? "text-white" : 
          isCompleted ? "text-green-500" :
          "text-gray-500 group-hover:text-gray-300"
        }`}>
          {isCompleted ? "Completed" : isActive ? "Active" : "Start Quest"}
        </button>
      </div>
    </motion.div>
  );
};

export default function LearningPaths({ 
  onSelectPath, 
  selectedPathId,
  completedPaths,
  startedPaths
}: { 
  onSelectPath: (id: PathId) => void;
  selectedPathId: PathId;
  completedPaths: Set<PathId>;
  startedPaths: Set<PathId>;
}) {
  const [filter, setFilter] = useState("All Quests");

  const filteredPaths = LEARNING_PATHS.filter(path => {
    if (filter === "All Quests") return true;
    if (filter === "Active") return startedPaths.has(path.id);
    if (filter === "Completed") return completedPaths.has(path.id);
    return true;
  });

  return (
    <section id="paths" className="py-24 px-4 bg-arc-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">Quest Curriculum</h3>
            <h2 className="text-3xl font-bold text-white mb-4">Ecosystem Mastery Paths</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Step-by-step interactive journeys designed to take you from a curious learner to a certified Arc Builder.
            </p>
          </div>
          <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
            {["All Quests", "Active", "Completed"].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filter === f ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path, idx) => (
              <PathCard 
                key={path.id} 
                path={path} 
                delay={idx * 0.05} 
                isActive={selectedPathId === path.id}
                isCompleted={completedPaths.has(path.id)}
                onClick={() => onSelectPath(path.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl"
          >
            <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LucideIcons.Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {filter === "Active" ? "No active quests" : "No completed quests yet"}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {filter === "Active" 
                ? "Start your first journey from the All Quests tab!" 
                : "Keep learning and finish your first module to earn your badge!"}
            </p>
            {filter !== "All Quests" && (
              <button 
                onClick={() => setFilter("All Quests")}
                className="mt-6 text-arc-accent font-bold text-xs uppercase tracking-widest hover:underline"
              >
                View All Quests
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
