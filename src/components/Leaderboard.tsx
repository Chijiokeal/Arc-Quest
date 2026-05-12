import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Users, Search, Flame, ChevronDown, Award, BookOpen, Wallet, Coins, FlaskConical, Code2, Rocket } from "lucide-react";
import { supabase } from "../lib/supabase";
import { LEARNING_PATHS } from "../constants";

const ICON_MAP: Record<string, any> = { BookOpen, Wallet, Coins, FlaskConical, Code2, Rocket };
const COLOR_MAP: Record<string, string> = {
  basics: "bg-blue-500", wallet: "bg-purple-500", stablecoins: "bg-emerald-500",
  testnet: "bg-orange-500", building: "bg-cyan-500", deploying: "bg-rose-500"
};

interface LeaderboardUser {
  id: string; username: string; xp: number; streak: number;
  badges_earned?: string[]; quests_completed?: number;
}
type FilterTab = "xp" | "streak";

export default function Leaderboard({ currentUsername }: { currentUsername?: string }) {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("xp");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase.from('users').select('id, username, xp, streak').order(activeTab, { ascending: false }).limit(20);
      if (error) throw error;
      setUsers(data || []);
    } catch (err) { console.error("Failed to fetch leaderboard", err); }
    finally { setLoading(false); }
  };

  const fetchUserDetails = async (userId: string) => {
    if (expandedUserId === userId) { setExpandedUserId(null); return; }
    const userInList = users.find(u => u.id === userId);
    if (userInList?.badges_earned !== undefined) { setExpandedUserId(userId); return; }
    setLoadingDetails(userId);
    try {
      const { data, error } = await supabase.from('users').select('badges_earned, quests_completed').eq('id', userId).single();
      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, badges_earned: data.badges_earned || [], quests_completed: data.quests_completed || 0 } : u));
      setExpandedUserId(userId);
    } catch (err) { console.error("Failed to fetch user details", err); }
    finally { setLoadingDetails(null); }
  };

  useEffect(() => {
    fetchLeaders();
    const interval = setInterval(fetchLeaders, 60000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10);

  return (
    <section id="leaderboard" className="py-24 px-4 bg-arc-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-arc-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-[#161B22]/80 backdrop-blur-md border border-gray-800 rounded-3xl flex flex-col p-6 md:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h3 className="text-xs font-bold text-arc-accent uppercase tracking-[0.2em] flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5" /> Live Standings
              </h3>
              <p className="text-2xl font-bold text-white tracking-tight">Ecosystem Leaders</p>
            </div>
            <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
              <button onClick={() => setActiveTab("xp")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "xp" ? "bg-arc-accent text-black shadow-lg shadow-arc-accent/20" : "text-gray-500 hover:text-gray-300"}`}>Top XP</button>
              <button onClick={() => setActiveTab("streak")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "streak" ? "bg-arc-accent text-black shadow-lg shadow-arc-accent/20" : "text-gray-500 hover:text-gray-300"}`}>
                <Flame className={`w-3.5 h-3.5 ${activeTab === "streak" ? "text-black" : "text-orange-500"}`} /> Top Streak
              </button>
            </div>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search builders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-arc-accent/50 focus:bg-gray-900/80 transition-all font-medium" />
          </div>

          <div className="space-y-3 min-h-[400px]">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="flex items-center justify-between p-4 rounded-2xl border border-gray-800/50 bg-gray-900/40">
                    <div className="flex items-center gap-5">
                      <div className="w-6 h-3 skeleton" />
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl skeleton" />
                        <div className="w-24 h-4 skeleton" />
                      </div>
                    </div>
                    <div className="w-16 h-6 skeleton" />
                  </div>
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, idx) => {
                  const isCurrent = currentUsername === user.username;
                  const isFirst = idx === 0 && !searchQuery;
                  const initials = user.username.slice(0, 2).toUpperCase();
                  const isExpanded = expandedUserId === user.id;
                  const isLoadingDetails = loadingDetails === user.id;
                  return (
                    <motion.div key={user.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      className={`flex flex-col rounded-2xl border transition-all overflow-hidden group ${isCurrent ? "bg-arc-accent/10 border-arc-accent shadow-[0_0_20px_rgba(6,182,212,0.1)] scale-[1.01]" : isFirst ? "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40" : "border-gray-800/50 bg-gray-900/40 hover:bg-gray-900/60 hover:border-gray-700"}`}>
                      <button onClick={() => fetchUserDetails(user.id)} className="flex justify-between items-center p-4 w-full text-left">
                        <div className="flex items-center gap-5">
                          <span className={`text-xs font-mono font-bold w-6 transition-colors ${isCurrent ? "text-arc-accent" : isFirst ? "text-yellow-500" : "text-gray-600 group-hover:text-gray-400"}`}>
                            {(idx + 1).toString().padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-bold border transition-all ${isCurrent ? "bg-arc-accent text-black border-arc-accent" : "bg-gray-800 text-gray-400 border-white/5 group-hover:bg-gray-700"}`}>{initials}</div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-bold tracking-tight transition-colors ${isCurrent ? "text-white" : "text-gray-300 group-hover:text-white"}`}>{user.username}</span>
                              {isCurrent && <span className="text-[9px] font-bold text-arc-accent uppercase tracking-widest mt-0.5">That's You</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`text-lg font-mono font-bold tracking-tighter ${isCurrent ? "text-white" : isFirst ? "text-yellow-500" : "text-gray-400"}`}>
                            {activeTab === "xp" ? user.xp.toLocaleString() : `${user.streak || 0}d`}
                          </span>
                          <div className="flex items-center justify-center w-8 h-8">
                            {isLoadingDetails ? <div className="w-4 h-4 border-2 border-arc-accent/30 border-t-arc-accent rounded-full animate-spin" /> : <ChevronDown className={`w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />}
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="bg-black/40 border-t border-gray-800/50">
                            <div className="p-6 space-y-6">
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <BookOpen className="w-3 h-3 text-arc-accent" /> Completed Learning Paths
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {user.badges_earned && user.badges_earned.length > 0 ? user.badges_earned.map(pathId => {
                                    const path = LEARNING_PATHS.find(p => p.id === pathId);
                                    return <div key={pathId} className="px-3 py-1.5 rounded-lg bg-arc-accent/5 border border-arc-accent/20 text-[10px] font-bold text-arc-accent uppercase tracking-wider">{path?.title.replace('Arc ', '')}</div>;
                                  }) : <p className="text-xs text-gray-600 italic">No quests completed yet.</p>}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                  <Award className="w-3 h-3 text-yellow-500/70" /> Earned Badges
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {user.badges_earned && user.badges_earned.length > 0 ? user.badges_earned.map(pathId => {
                                    const path = LEARNING_PATHS.find(p => p.id === pathId);
                                    if (!path) return null;
                                    const BadgeIcon = ICON_MAP[path.icon] || Award;
                                    const pathColor = COLOR_MAP[pathId] || "bg-gray-500";
                                    return (
                                      <div key={`badge-${pathId}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-800/30 border border-white/5">
                                        <div className={`w-8 h-8 rounded-lg ${pathColor} bg-opacity-20 flex items-center justify-center`}>
                                          <BadgeIcon className={`w-4 h-4 ${pathColor.replace('bg-', 'text-')}`} />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[11px] font-bold text-white tracking-tight">{path.title} Badge</span>
                                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Level Certified</span>
                                        </div>
                                      </div>
                                    );
                                  }) : <p className="text-xs text-gray-600 italic">No badges earned yet.</p>}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Users className="w-12 h-12 text-gray-800 mb-4" />
                <p className="text-gray-500 text-sm font-medium">
                  {searchQuery ? "No builder found." : "No builders found yet."}<br/>
                  {searchQuery ? "Try a different username." : "Be the first to join the leaderboard!"}
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-800/50">
            <div className="p-5 rounded-2xl bg-gray-900/50 border border-dashed border-gray-800 text-center group hover:border-arc-accent/30 transition-all">
              <p className="text-[11px] text-gray-500 italic flex items-center justify-center gap-3">
                <Users className="w-4 h-4 text-arc-accent opacity-50" /> Join 24,000+ builders currently mastering the Arc ecosystem
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  }
