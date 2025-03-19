import SectionTitle from "./SectionTitle";
import micIcon from "../../assets/icons/mic-icon.svg";
import fileTextIcon from "../../assets/icons/file-text-icon.svg";
import networkIcon from "../../assets/icons/network-icon.svg";
import shareIcon from "../../assets/icons/share-icon.svg";
import { motion } from "framer-motion";
import { scale, staggerContainer } from "../../utils/motion";

const FeaturesSection = () => {
  const featureCards = [
    {
      icon: micIcon,
      title: "Transcribe voice notes",
      description:
        "Convert speech into text for quick and effortless note-taking",
    },
    {
      icon: fileTextIcon,
      title: "Summarize notes instantly",
      description: "Get concise summaries of your notes in just one click",
    },
    {
      icon: networkIcon,
      title: "Generate mind maps",
      description: "Turn your notes into structured visual mind maps",
    },
    {
      icon: shareIcon,
      title: "Share notes easily",
      description: "Collaborate and share notes seamlessly with others",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer(0.2, 0.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mt-32 flex flex-col items-center px-6 md:mt-52"
      id="features"
    >
      <SectionTitle
        subTitle="Powerful Features"
        title="What can you do with ThinkFlow?"
      />
      <div className="mx-auto mt-2 grid w-[272px] grid-cols-1 md:mt-[60px] md:w-[600px] md:grid-cols-2 xl:w-[1204px] xl:grid-cols-4">
        {featureCards.map((featureCard, index) => (
          <motion.div
            variants={scale(index * 0.2)}
            key={index}
            className="border-gallery flex flex-col items-center gap-3.5 px-5 py-8 text-center not-last:border-b md:gap-7 md:px-8 md:not-last:border-r md:nth-[2]:border-r-0 md:nth-[3]:border-b-0 xl:py-0 xl:first:border-b-0 xl:nth-[2]:border-r xl:nth-[2]:border-b-0"
          >
            <img
              src={featureCard.icon}
              alt={featureCard.icon.split("/").pop().replace(".svg", "")}
            />
            <div>
              <h3 className="font-body text-ebony-clay text-base/normal font-semibold md:text-lg/normal">
                {featureCard.title}
              </h3>
              <p className="text-gravel font-body mt-1.5 text-sm/normal md:mt-3 md:text-base/normal">
                {featureCard.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
