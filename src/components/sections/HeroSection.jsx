import PrimaryButton from "../ui/buttons/PrimaryButton";
import { motion } from "framer-motion";
import { scale, staggerContainer, textVariant } from "../../utils/motion";

const HeroSection = () => {
  return (
    <motion.section
      variants={staggerContainer(0.2, 0.4)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="z-10 mt-20 w-[300px] px-3 text-center md:mt-12 md:w-[654px]"
      id="home"
    >
      <motion.h1
        variants={textVariant(0.4)}
        className="font-heading text-ebony-clay text-2xl/normal font-bold md:text-5xl/normal"
      >
        Transform the way <br className="hidden md:inline-block" />
        you notes with ThinkFlow
      </motion.h1>
      <motion.p
        variants={textVariant(0.6)}
        className="font-body text-gravel mt-4 text-sm/normal md:mt-7 md:text-lg/normal"
      >
        Effortlessly capture ideas and turn them into summaries or mind maps for
        smarter, more efficient studying
      </motion.p>
      <motion.div variants={scale(0.8)} className="mt-3 md:mt-5">
        <PrimaryButton color="blue" label="Get Started" />
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
