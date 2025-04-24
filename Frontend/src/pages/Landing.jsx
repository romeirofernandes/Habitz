import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const cursorRef = useRef < HTMLDivElement > null;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Scroll progress for animations
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#f5f5f7] overflow-hidden">
      {/* Custom cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 rounded-full bg-green-500/30 pointer-events-none z-50 mix-blend-screen"
        style={{
          left: cursorX,
          top: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Floating navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300 ${
          isScrolled ? "bg-[#0a0a0a]/80 backdrop-blur-md" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="font-serif text-xl font-bold">Foliage</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "About", "Blog"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-[#f5f5f7]/80 hover:text-green-400 transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              href="#"
              className="text-[#f5f5f7]/80 hover:text-green-400"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </motion.a>
            <motion.button
              className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effect - Grid pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(20,1fr)]">
            {[...Array(900)].map((_, i) => {
              const row = Math.floor(i / 40);
              const col = i % 40;
              const delay = (row + col) * 0.01;

              return (
                <motion.div
                  key={i}
                  className="w-0.5 h-0.5 rounded-full bg-green-500/20"
                  style={{
                    gridColumn: col + 1,
                    gridRow: row + 1,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center px-6"
          style={{ y, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-3 py-1 mb-6 rounded-full bg-green-500/20 text-green-400 text-sm"
          >
            Sustainable. Innovative. Powerful.
          </motion.div>

          <motion.h1
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Grow your ideas with <span className="text-green-600">Foliage</span>
          </motion.h1>

          <motion.p
            className="text-[#f5f5f7]/80 text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The intelligent workspace that adapts to your workflow. Organize,
            connect, and cultivate your best ideas.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="bg-green-800 hover:bg-green-900 text-white px-6 py-3 rounded-md font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start growing
            </motion.button>
            <motion.button
              className="border border-[#f5f5f7]/20 hover:border-green-400 text-[#f5f5f7] px-6 py-3 rounded-md font-medium"
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(74, 222, 128, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Take a tour
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl font-bold mb-4">
              Features that <span className="text-green-400">nurture</span>{" "}
              growth
            </h2>
            <p className="text-[#f5f5f7]/80 max-w-2xl mx-auto">
              Tools designed to help your ideas flourish and reach their full
              potential.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Organic Organization",
                description:
                  "Structure your thoughts naturally with our intuitive organization system.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6.5H21M3 12H21M3 17.5H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Idea Cultivation",
                description:
                  "Nurture your concepts with tools that help them develop and mature over time.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2V5M12 19V22M4.93 4.93L7.05 7.05M16.95 16.95L19.07 19.07M2 12H5M19 12H22M4.93 19.07L7.05 16.95M16.95 7.05L19.07 4.93M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                title: "Cross-Pollination",
                description:
                  "Discover connections between ideas that spark new insights and innovations.",
                icon: (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.5 7L4.5 12L9.5 17M14.5 7L19.5 12L14.5 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 hover:border-green-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -10px rgba(74, 222, 128, 0.3)",
                }}
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 text-green-400">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#f5f5f7]/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 relative bg-[#0a0a0a]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => {
              const top = Math.random() * 100;
              const left = Math.random() * 100;
              const size = Math.random() * 2 + 1;

              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-green-400"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl font-bold mb-4">
              What our <span className="text-green-400">community</span> says
            </h2>
            <p className="text-[#f5f5f7]/80 max-w-2xl mx-auto">
              Hear from people who have transformed their creative process with
              Foliage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "Foliage has completely changed how I approach my creative projects. The organic organization makes it feel like my ideas are growing naturally.",
                author: "Maya Rodriguez",
                role: "Creative Director",
              },
              {
                quote:
                  "I've never found a tool that so perfectly matches my thought process. It's like Foliage understands how my mind works.",
                author: "James Wilson",
                role: "Author & Researcher",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-green-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -10px rgba(74, 222, 128, 0.3)",
                }}
              >
                <div className="mb-4 text-green-400">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.13456 9H3.38293C3.15993 9 3.04843 9 2.96272 9.04524C2.88779 9.08511 2.83086 9.15272 2.80409 9.23304C2.77344 9.32562 2.80011 9.44324 2.85344 9.67848L4.23145 14.6785C4.29045 14.9334 4.31996 15.0608 4.38547 15.1566C4.44296 15.2416 4.52504 15.3085 4.62177 15.3492C4.73054 15.3954 4.86512 15.3954 5.13428 15.3954H7.5M9.13456 9L7.5 15.3954M9.13456 9H14.8654M7.5 15.3954V20M14.8654 9H20.6171C20.8401 9 20.9516 9 21.0373 9.04524C21.1122 9.08511 21.1691 9.15272 21.1959 9.23304C21.2266 9.32562 21.1999 9.44324 21.1466 9.67848L19.7686 14.6785C19.7096 14.9334 19.68 15.0608 19.6145 15.1566C19.557 15.2416 19.475 15.3085 19.3782 15.3492C19.2695 15.3954 19.1349 15.3954 18.8657 15.3954H16.5M14.8654 9L16.5 15.3954M16.5 15.3954V20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#f5f5f7]/90 mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-[#f5f5f7]/60 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <motion.div
          className="max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl font-bold mb-6">
            Ready to <span className="text-green-400">cultivate</span> your
            ideas?
          </h2>
          <p className="text-[#f5f5f7]/80 max-w-2xl mx-auto mb-8">
            Join our growing community of thinkers, creators, and innovators.
          </p>
          <motion.button
            className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 rounded-md font-medium text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start your free trial
          </motion.button>
          <p className="text-[#f5f5f7]/60 text-sm mt-4">
            14-day trial, no credit card required
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#222]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.div
              className="flex items-center gap-2 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="font-serif text-xl font-bold">Foliage</span>
            </motion.div>

            <div className="flex gap-6">
              {["Twitter", "GitHub", "Discord", "LinkedIn"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-[#f5f5f7]/70 hover:text-green-400 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="border-t border-[#222] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#f5f5f7]/60 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Foliage. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-[#f5f5f7]/60 text-sm hover:text-green-400 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
