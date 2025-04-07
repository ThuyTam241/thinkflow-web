import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import AboutSection from "../components/sections/AboutSection";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import circlePairShape from "../assets/images/circle-pair-shape.svg";
import circlePairShapeDark from "../assets/images/circle-pair-shape-dark.svg";
import { useContext } from "react";
import { ThemeContext } from "../components/context/ThemeContext";

const LandingPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className="flex h-80 w-full items-center justify-center bg-[radial-gradient(50%_50%_at_50%_50%,_#DAD7FC_0%,_#EDEBFE_50%,_#FFFFFF_100%)] md:h-[640px] lg:h-[712px] dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#4C3D99_0%,_rgba(43,35,101,0.5)_50%,_rgba(10,9,48,0)_100%)]">
        <Navbar />

        <motion.img
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          viewport={{ once: true }}
          whileInView="show"
          className="absolute top-16 left-1/2 w-2xs -translate-x-1/2 md:top-20 min-w-2xs md:w-[624px] lg:top-36"
          src={theme === "light" ? circlePairShape : circlePairShapeDark}
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
