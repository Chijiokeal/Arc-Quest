import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  Users, 
  Database, 
  Zap, 
  X, 
  ShieldCheck, 
  Lock, 
  Wallet, 
  Coins, 
  FlaskConical, 
  Code2, 
  Rocket,
  CircleDollarSign
} from "lucide-react";
import { LEARNING_PATHS } from "../constants";
import { PathId } from "../types";

const BadgeAnimation = ({ id, isEarned }: { id: PathId; isEarned: boolean }) => {
  const containerClass = `relative w-full h-full flex items-center justify-center transition-all duration-500 ${isEarned ? "" : "grayscale"}`;

  const renderAnimation = () => {
    switch (id) {
      case "basics":
        return (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full border-2 border-arc-accent border-t-transparent flex items-center justify-center relative"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 bg-arc-accent/20 rounded-full blur-md absolute inset-0 m-auto"
            />
            <Zap className="w-6 h-6 text-arc-accent" />
          </motion.div>
        );
      case "wallet":
        return (
          <motion.div className="relative">
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Wallet className="w-12 h-12 text-arc-accent" />
            </motion.div>
            <motion.div
              animate={{ y: [-5, -25, -35], x: [0, 10, -10], opacity: [0, 1, 0], scale: [0.5, 1, 1.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              className="absolute top-0 left-1/2 -translate-x-1/2"
            >
              <CircleDollarSign className="w-5 h-5 text-arc-accent" />
            </motion.div>
          </motion.div>
        );
      case "stablecoins":
        return (
          <div className="relative">
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-arc-accent flex items-center justify-center border-4 border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <span className="text-white font-black text-2xl">$</span>
            </motion.div>
            <motion.div 
              animate={{ x: [-100, 100], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute top-0 left-[-20%] w-[140%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          </div>
        );
      case "testnet":
        return (
          <div className="relative flex items-center justify-center">
            <div className="relative z-10 w-12 h-12 bg-arc-bg rounded-xl border border-arc-accent/50 flex items-center justify-center shadow-lg">
              <FlaskConical className="w-7 h-7 text-arc-accent" />
            </div>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: [0, 0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "easeOut" }}
                className="absolute w-12 h-12 border border-arc-accent rounded-full"
              />
            ))}
          </div>
        );
      case "building":
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: i * 0.2, 
                    duration: 0.5,
                    repeat: Infinity, 
                    repeatDelay: 1.5
                  }}
                  className="w-5 h-5 bg-arc-accent rounded-md shadow-sm"
                />
              ))}
            </div>
            <Code2 className="w-5 h-5 text-arc-accent/40 mt-2" />
          </div>
        );
      case "deploying":
        return (
          <div className="relative">
            <motion.div 
              animate={{ 
                y: [0, -8, 0],
                x: [0, 1, -1, 0]
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="relative z-10"
            >
              <Rocket className="w-14 h-14 text-arc-accent" />
            </motion.div>
            <motion.div 
              animate={{ 
                height: [10, 30, 20],
                opacity: [0.6, 1, 0.4],
                scaleX: [1, 1.5, 1]
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute top-[80%] left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-orange-500 via-yellow-500 to-transparent blur-[2px] rounded-full"
            />
          </div>
        );
      default:
        return <Terminal className="w-12 h-12 text-arc-accent" />;
    }
  };

  return (
    <div className={containerClass}>
       <div className="flex items-center justify-center w-full h-full">
         {renderAnimation()}
       </div>
       {!isEarned && (
         <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full border border-white/10">
              <Lock className="w-5 h-5 text-white" />
            </div>
         </div>
       )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, delay, onClick, isLoading }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    onClick={onClick}
    className={`bg-[#161B22] p-4 rounded-xl border border-gray-800 flex items-center gap-4 group transition-all min-h-[76px] ${
      onClick ? "cursor-pointer hover:border-arc-accent/50" : "hover:border-arc-accent/30"
    }`}
  >
    {isLoading ? (
      <>
        <div className="w-10 h-10 rounded-lg skeleton shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <div className="w-16 h-5 skeleton" />
          <div className="w-12 h-3 skeleton" />
        </div>
      </>
    ) : (
      <>
        <div className="w-10 h-10 rounded-lg bg-arc-accent/10 flex items-center justify-center group-hover:bg-arc-accent/20 transition-colors shrink-0">
          <Icon className="w-5 h-5 text-arc-accent" />
        </div>
        <div>
          <div className="text-xl font-bold text-white font-mono leading-none">{value}</div>
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">{label}</div>
        </div>
      </>
    )}
  </motion.div>
);

export default function Hero({ 
  answeredCount, 
  completedCount,
  completedPathIds,
  isLoading
}: { 
  answeredCount: number; 
  completedCount: number;
  completedPathIds: Set<PathId>;
  isLoading: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <section id="hero" className="pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight"
          >
            Master the Arc Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed"
          >
            Learn about stablecoins, wallet setup, and building financial apps on the Arc testnet. <span className="text-arc-accent font-medium italic">Learn. Build. Explore Arc.</span>
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Zap} label="Quests" value={`${answeredCount}/∞`} delay={0.2} isLoading={isLoading} />
          <StatCard icon={Users} label="Builders" value="24,000+" delay={0.3} isLoading={isLoading} />
          <StatCard icon={Database} label="Topics" value="6" delay={0.4} isLoading={isLoading} />
          <StatCard 
            icon={Terminal} 
            label="Badges" 
            value={`${completedCount}/6`} 
            delay={0.5} 
            onClick={toggleModal}
            isLoading={isLoading}
          />
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => { if (info.offset.y > 150) toggleModal(); }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="relative w-full max-w-2xl bg-[#161B22] border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-arc-accent/5 blur-[60px] rounded-full" />
              <div className="flex justify-center mb-4 sm:hidden">
                <div className="w-12 h-1 bg-gray-800 rounded-full" />
              </div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-arc-accent" />
                    Your Achievements
                  </h3>
                  <p className="text-gray-500 text-sm">Track your progress and collections across the Arc ecosystem.</p>
                </div>
                <button 
                  onClick={toggleModal}
                  className="group relative w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 transition-all shadow-lg active:scale-90"
                >
                  <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 relative z-10">
                {LEARNING_PATHS.map((path) => {
                  const isEarned = completedPathIds.has(path.id);
                  return (
                    <div key={path.id} className="text-center group">
                      <div className={`aspect-square rounded-2xl flex items-center justify-center mb-3 transition-all duration-500 ${
                        isEarned 
                          ? "bg-arc-accent/10 border-2 border-arc-accent shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                          : "bg-gray-900/50 border border-gray-800"
                      }`}>
                         <div className="w-20 h-20 flex items-center justify-center">
                            <BadgeAnimation id={path.id} isEarned={isEarned} />
                         </div>
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        isEarned ? "text-white" : "text-gray-500"
                      }`}>
                         {path.title} Badge
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-10 pt-8 border-t border-gray-800 text-center relative z-10">
                <p className="text-xs text-gray-500 italic">
                  Earn all 6 badges to become a <span className="text-arc-accent font-bold">Legendary Arc Builder</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
            }
