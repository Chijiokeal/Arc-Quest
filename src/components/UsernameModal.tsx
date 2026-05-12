import React, { useState } from "react";
import { motion } from "motion/react";
import { User, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

interface UsernameModalProps {
  onComplete: (username: string) => void;
}

export default function UsernameModal({ onComplete }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) { setError("Username must be at least 3 characters"); return; }
    onComplete(username.trim());
  };

  const handleDiscordLogin = async () => {
    setIsDiscordLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord', options: { redirectTo: window.location.origin } });
      if (error) throw error;
    } catch (err) {
      console.error("Discord login failed:", err);
      setIsDiscordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#161B22] border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-arc-accent/10 blur-[60px] rounded-full" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-arc-accent/10 rounded-2xl flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-arc-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome, Builder</h2>
          <p className="text-gray-400 mb-8">Choose a display name or connect with Discord to start your journey.</p>
          <div className="space-y-6">
            <button onClick={handleDiscordLogin} disabled={isDiscordLoading}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#5865F2]/20 disabled:opacity-50">
              {isDiscordLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              )}
              Login with Discord
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-grow h-px bg-gray-800" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">or</span>
              <div className="flex-grow h-px bg-gray-800" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Manual Username</label>
                <input type="text" id="username" value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="e.g. Satoshi_N"
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-arc-accent/50 transition-all placeholder:text-gray-700 font-medium" />
                {error && <p className="text-red-400 text-xs mt-2 ml-1 font-medium">{error}</p>}
              </div>
              <button type="submit"
                className="w-full bg-transparent hover:bg-white/5 text-arc-accent border border-arc-accent/30 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
                Enter as Guest <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-8 font-bold uppercase tracking-tighter max-w-[200px] mx-auto leading-relaxed">
            Your username is your key — remember it to restore your progress next time you visit.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
