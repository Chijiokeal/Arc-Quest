import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

export default function Toolkit() {
  return (
    <section className="py-12 px-4 bg-arc-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-arc-accent/20 bg-gradient-to-br from-[#161B22] to-arc-bg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="max-w-xl relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] bg-white text-black px-2 py-1 rounded font-bold uppercase">ArcBuild</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">by Dawgpool</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
              A community guide for everything <br /> you need to start building on Arc.
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed">
              Step-by-step documentation designed for new and experienced builders alike. From setting up your wallet to connecting to the testnet and deploying your first application.
            </p>
            <a href="https://buildonarcguide.netlify.app/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-arc-accent hover:underline group">
              View Documentation
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
          <div className="relative hidden md:block">
            <div className="w-64 h-[400px] lg:w-72 lg:h-[450px] rounded-[3rem] border border-white/10 bg-white shadow-2xl rotate-3 p-1 flex flex-col overflow-hidden">
              <div className="bg-[#F8F9FB] flex-1 rounded-[2.5rem] p-6 flex flex-col items-center text-center">
                <div className="bg-[#EBF2FF] px-3 py-1 rounded-full flex items-center gap-1.5 mb-8">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Testnet Live</span>
                </div>
                <h3 className="text-2xl font-black text-[#0D1117] tracking-tight mb-4 leading-tight">Build on Arc</h3>
                <p className="text-[11px] text-[#4B5E7C] font-medium leading-relaxed mb-10 px-2">
                  A simple starter guide to building apps with Arc. Create high-performance financial applications with minimal friction.
                </p>
                <div className="w-full space-y-3 mt-auto">
                  <div className="w-full py-4 bg-[#1D4ED8] rounded-2xl flex items-center justify-center gap-2 text-white text-[11px] font-bold shadow-lg shadow-blue-500/20">
                    Get Started <div className="w-4 h-4 flex items-center justify-center">→</div>
                  </div>
                  <div className="w-full py-4 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center text-[#4B5E7C] text-[11px] font-bold">
                    View GitHub
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-4 -left-4 w-64 h-[400px] lg:w-72 lg:h-[450px] rounded-[3rem] border border-gray-800 bg-gray-900/30 -rotate-3 -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
