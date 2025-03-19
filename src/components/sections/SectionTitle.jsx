import { motion } from "framer-motion";
import { textVariant } from "../../utils/motion";

const SectionTitle = ({ subTitle, title }) => {
  return (
    <motion.div variants={textVariant(0.2)} className="text-center">
      <h6 className="text-gravel font-body text-sm font-semibold md:text-base">
        {subTitle}
      </h6>
      <h1 className="text-ebony-clay font-heading mt-2 text-[22px]/normal font-bold md:mt-4 md:text-4xl/normal">
        {title}
      </h1>
    </motion.div>
  );
};

export default SectionTitle;
