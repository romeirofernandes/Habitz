import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Smart Tracking",
    description:
      "Track your habits with intelligent reminders and streak monitoring.",
    icon: "📊",
  },
  {
    title: "Progress Analytics",
    description:
      "Visualize your journey with detailed insights and progress reports.",
    icon: "📈",
  },
  {
    title: "Social Accountability",
    description: "Connect with friends to stay motivated and consistent.",
    icon: "🤝",
  },
  {
    title: "Personalized Goals",
    description: "Set and adjust your habit goals based on your pace.",
    icon: "⚡",
  },
];

// ...existing imports...

const Features = () => {
  return (
    <section id="features" className="py-30 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* ...existing motion.div... */}

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 hover:border-[#A2BFFE]/50 transition-colors backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(162, 191, 254, 0.2)",
              }}
            >
              <div className="w-12 h-12 bg-[#A2BFFE]/20 rounded-lg flex items-center justify-center mb-4 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-[#f5f5f7]/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
