import PrimaryButton from "../ui/buttons/PrimaryButton";
import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { scale, staggerContainer, textVariant } from "../../utils/motion";

const AboutSection = () => {
  return (
    <motion.section
      variants={staggerContainer(0.2, 0.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mx-auto mt-32 mb-24 max-w-3xl px-6 md:mt-40 md:mb-[120px]"
      id="about"
    >
      <SectionTitle
        subTitle="About"
        title="Capture, organize, and collaborate effortlessly"
      />
      <div className="mt-8 flex flex-col items-center gap-6 md:mt-10">
        <motion.p
          variants={textVariant(0.4)}
          className="font-body text-ebony-clay text-center text-sm/normal md:text-base/normal"
        >
          ThinkFlow is an intelligent, AI-powered note-taking application
          designed to enhance productivity and streamline information management
          for students, professionals, and teams
        </motion.p>
        <motion.div variants={scale(0.5)}>
          <PrimaryButton color="blue" label="Get Started" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
