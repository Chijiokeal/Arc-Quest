import { motion } from "motion/react";
import { CreditCard, Coins, Code2, Rocket } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-8 rounded-3xl glow-border group h-full"
  >
    <div className="w-14 h-14 rounded-2xl bg-arc-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-arc-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-gradient-to-b from-arc-bg to-[#080808]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What is Arc?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Arc is built to move money at the speed of the internet, making digital finance accessible to everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard icon={CreditCard} title="Payments" description="Fast global transactions powered by blockchain. Low fees, instant finality, and seamless integration." delay={0.1} />
          <FeatureCard icon={Coins} title="Stablecoins" description="Built for real-world digital finance. Leverage the power of stable assets pegged to major currencies." delay={0.2} />
          <FeatureCard icon={Code2} title="Developer Friendly" description="Easy onboarding for new builders. Comprehensive APIs and SDKs to get you building in minutes." delay={0.3} />
          <FeatureCard icon={Rocket} title="Testnet Ready" description="Experiment safely before mainnet launch. Use our robust testnet environments to iterate on your apps." delay={0.4} />
        </div>
      </div>
    </section>
  );
}
