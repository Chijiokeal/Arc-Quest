import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { LEARNING_PATHS } from "../constants";
import { PathId } from "../types";

const IconWrapper = ({ iconName, className }: { iconName: string; className?: string }) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon className={className} /> : null;
};

export default function Progress({ 
  xp, streak, correctCount, totalQuestions, completedPathIds = new Set(), isLoading
}: { 
  xp: number; streak: number; correctCount: number; totalQuestions: number;
  completedPathIds?: Set<PathId>; isLoading?: boolean;
}) {
  const xpPercentage = Math.min((xp / 3000) * 100, 100);
  const getLevel = (val: number) => {
    if (val < 600) return "BEGINNER ARCHITECT";
    if (val < 1200) return "ADVANCED ARCHITECT";
    if (val < 1800) return "EXPERT ARCHITECT";
    if (val < 2400) return "MASTER ARCHITECT";
    return "GRAND MASTER ARCHITECT";
  };
  const levelTitle = getLevel(xp);

  return (
    <section id="dashboard" className="py-24 px-4 bg-arc-bg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#161B22] p-6 rounded-2xl border border-gray-800 shadow-xl group hover:border-arc-accent/30 transition-all min-h-[110px]">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Experience</p>
                {isLoading ? <div className="w-24 h-10 skeleton" /> : (
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-white transition-all group-hover:scale-110 origin-left">{xp.toLocaleString()}</p>
                    <p className="text-xs font-bold text-arc-accent">XP</p>
                  </div>
                )}
              </div>
              <div className="bg-[#161B22] p-6 rounded-2xl border border-gray-800 shadow-xl group hover:border-purple-500/30 transition-all min-h-[110px]">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Current Streak</p>
                {isLoading ? <div className="w-24 h-10 skeleton" /> : (
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-purple-500 transition-all group-hover:scale-110 origin-left">{streak}d</p>
                    <p className="text-xs font-bold text-purple-400">Streak</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#161B22] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-arc-accent/5 blur-[80px] rounded-full" />
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Build Proficiency</h3>
                  <p className="text-gray-500 text-sm">Real-time skills assessment across Arc protocols</p>
                </div>
                <div className="px-4 py-2 bg-arc-accent/10 border border-arc-accent/20 rounded-xl min-w-[120px] h-9 flex items-center justify-center">
                  {isLoading ? <div className="w-20 h-4 skeleton" /> : (
                    <span className="text-[10px] text-arc-accent font-bold uppercase tracking-widest">{levelTitle}</span>
                  )}
                </div>
              </div>
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mastery Progress</span>
                    {isLoading ? <div className="w-8 h-4 skeleton" /> : (
                      <span className="text-xs font-mono text-arc-accent">{Math.round(xpPercentage)}%</span>
                    )}
                  </div>
                  <div className="h-3 w-full bg-gray-800/50 rounded-full overflow-hidden border border-white/5">
                    {isLoading ? <div className="h-full w-1/3 skeleton" /> : (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full arc-gradient shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                    <span>Beginner</span><span>Advanced</span><span>Expert</span><span>Master</span><span>Grand Master</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 flex flex-col gap-4">
            <div className="bg-[#161B22] border border-gray-800 rounded-2xl p-6 h-full min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent Badges</h3>
                {isLoading ? <div className="w-16 h-3 skeleton" /> : (
                  <span className="text-[10px] font-mono text-arc-accent">{completedPathIds.size} Earned</span>
                )}
              </div>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={`badge-skel-${i}`} className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-square rounded-xl skeleton" />
                      <div className="w-12 h-2 skeleton" />
                    </div>
                  ))}
                </div>
              ) : completedPathIds.size > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from(completedPathIds).reverse().map((id, idx) => {
                    const path = LEARNING_PATHS.find(p => p.id === id);
                    if (!path) return null;
                    return (
                      <motion.div key={id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="flex flex-col items-center gap-2 group">
                        <div className="w-full aspect-square rounded-xl bg-arc-accent/5 border border-arc-accent/20 flex items-center justify-center group-hover:bg-arc-accent/10 group-hover:border-arc-accent/40 shadow-lg shadow-arc-accent/5 transition-all">
                          <IconWrapper iconName={path.icon} className="w-8 h-8 text-arc-accent animate-pulse" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 group-hover:text-white transition-colors text-center w-full truncate px-1">{path.title}</span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 border border-dashed border-gray-800 rounded-2xl text-center">
                  <LucideIcons.ShieldAlert className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">No badges yet.<br/>Complete a quest!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
