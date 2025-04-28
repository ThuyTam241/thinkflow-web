import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { scale, staggerContainer } from "../../utils/motion";

const HowItWorksSection = () => {
  const howItWorksCards = [
    "Capture your notes through typing or voice",
    "Organize and structure them easily",
    "Transform them into summaries or mind maps",
    "Share and review effortlessly",
  ];

  return (
    <motion.section
      variants={staggerContainer(0.2, 0.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mt-28 px-6 md:mt-[150px]"
      id="how-it-works"
    >
      <SectionTitle
        subTitle="Effortless Note-Taking"
        title="How you can use ThinkFlow"
      />
      <div className="mx-auto mt-10 grid w-[222px] grid-cols-1 gap-7 md:mt-[60px] md:w-[472px] md:grid-cols-2 lg:w-[972px] lg:grid-cols-4">
        {howItWorksCards.map((howItWorksCard, index) => (
          <motion.div
            variants={scale(index * 0.2)}
            key={index}
            className="flex h-[120px] flex-col justify-center rounded-[10px] border border-gray-200 p-4 text-center dark:border-gray-100/20"
          >
            <h3 className="font-body text-ebony-clay text-base font-semibold md:text-lg/[25px]">
              Step {index + 1}
            </h3>
            <p className="text-gravel font-body mt-1.5 text-sm/normal md:mt-3 md:text-base/normal">
              {howItWorksCard}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
