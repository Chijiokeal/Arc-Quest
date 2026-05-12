import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { name: "Dashboard", href: "#hero" },
  { name: "Quests", href: "#paths" },
  { name: "Build", href: "#build" },
  { name: "Leaderboard", href: "#leaderboard" },
];

export default function Navbar({ 
  username = "BlockBuilder", 
  avatarUrl,
  onLogout 
}: { 
  username?: string, 
  avatarUrl?: string | null,
  onLogout: () => void 
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileExpanded, setIsMobileProfileExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/50 z-[50] md:hidden cursor-pointer"
          />
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-[60] bg-arc-bg/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Logo className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-arc-accent/30 transition-all duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-tight">Arc Quest</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-medium leading-none">Unofficial community learning platform</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setActiveLink(link.name)}
                  className={`transition-colors hover:text-white ${activeLink === link.name ? "text-arc-accent" : ""}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-6">
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10 group cursor-pointer"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white leading-none whitespace-nowrap overflow-hidden max-w-[120px] text-ellipsis">{username}</span>
                    <span className="text-[9px] text-arc-accent font-bold uppercase tracking-widest leading-none mt-1">Certified</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-arc-accent/30 p-0.5 group-hover:scale-105 transition-transform overflow-hidden relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] font-bold text-white uppercase">{initials}</div>
                    )}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-500 group-hover:text-gray-300 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-[#161B22] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden py-1.5 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-800/50 mb-1.5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{username}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white border border-transparent hover:border-gray-800"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-[#0D1117] border-b border-gray-800 shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {NAV_LINKS.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setActiveLink(link.name);
                      closeMenu();
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`block px-4 py-4 rounded-2xl text-base font-bold transition-all active:scale-95 ${
                      activeLink === link.name ? "text-arc-accent bg-arc-accent/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.name}</span>
                      <div className={`w-1.5 h-1.5 rounded-full bg-arc-accent transition-opacity ${
                        activeLink === link.name ? "opacity-100" : "opacity-0"
                      }`} />
                    </div>
                  </motion.a>
                ))}
              </div>
              <div className="bg-gradient-to-r from-transparent via-gray-800/50 to-transparent h-px w-full" />
              <div className="p-6 bg-[#161B22]/50">
                <button 
                  onClick={() => setIsMobileProfileExpanded(!isMobileProfileExpanded)}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-arc-accent/10 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={username} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-arc-accent/20 flex items-center justify-center text-[10px] font-bold text-arc-accent border border-arc-accent/30 uppercase">{initials}</div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{username}</p>
                      <p className="text-xs text-arc-accent">Certified Arc Developer</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isMobileProfileExpanded ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isMobileProfileExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          onLogout();
                          closeMenu();
                        }}
                        className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-500/10 border border-red-500/20 active:scale-95 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
                }
