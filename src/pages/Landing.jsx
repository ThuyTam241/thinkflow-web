import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import AboutSection from "../components/sections/AboutSection";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import trapezoidShape from "../assets/images/trapezoid-shape.svg";
import circlePairShape from "../assets/images/circle-pair-shape.svg";

const LandingPage = () => {
  return (
    <>
      <div className="from-hawkes-blue flex h-80 w-full items-center justify-center bg-gradient-to-b via-[rgba(218,215,252,0.6)] to-[rgba(218,215,252,0.15)] md:h-[640px] lg:h-[712px]">
        <Navbar />

        <motion.img
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          viewport={{ once: true }}
          whileInView="show"
          src={trapezoidShape}
          alt="trapezoid-shape"
          className="absolute top-0 left-1/2 hidden -translate-x-1/2 lg:flex"
        />

        <motion.img
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          viewport={{ once: true }}
          whileInView="show"
          className="absolute top-16 left-1/2 w-2xs -translate-x-1/2 md:top-20 md:w-[624px] lg:top-36"
          src={circlePairShape}
          alt="circle-pair-shape"
        />

        <HeroSection />
      </div>

      <FeaturesSection />

      <HowItWorksSection />

      <TestimonialsSection />

      <AboutSection />

      <Footer />
    </>
  );
};

export default LandingPage;
