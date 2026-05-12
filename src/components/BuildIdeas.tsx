import { motion } from "motion/react";
import { Send, ShoppingBag, Briefcase, Wallet, Store, HandCoins } from "lucide-react";

const IDEAS = [
  { icon: Send, title: "Remittance Apps", description: "Build ultra-low cost cross-border payment solutions for migrant workers and families." },
  { icon: ShoppingBag, title: "Payment Platforms", description: "Create next-gen e-commerce checkouts that settle instantly with stablecoins." },
  { icon: Briefcase, title: "Freelance Payouts", description: "Automate global payouts for digital nomads and overseas contractors." },
  { icon: Wallet, title: "Savings Wallets", description: "Design high-yield savings products backed by stablecoin lending protocols." },
  { icon: Store, title: "Business Tools", description: "Develop treasury management and B2B payment software for modern enterprises." },
  { icon: HandCoins, title: "Lending Apps", description: "Launch decentralized lending markets for real-world assets on-chain." }
];

export default function BuildIdeas() {
  return (
    <section id="build" className="py-24 px-4 bg-arc-bg">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">Possibilities</h3>
          <h2 className="text-3xl font-bold text-white mb-4">What can you build on Arc?</h2>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">The infrastructure is ready. Leverage Arc's robust APIs to build the future of global finance.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {IDEAS.map((idea, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="bg-[#161B22] p-8 rounded-2xl border border-gray-800 group hover:border-arc-accent/30 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-arc-accent/10 flex items-center justify-center mb-6 group-hover:bg-arc-accent/20 transition-colors">
                <idea.icon className="w-6 h-6 text-arc-accent" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-arc-accent transition-colors">{idea.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{idea.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
