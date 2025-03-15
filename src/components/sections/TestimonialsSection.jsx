import SectionTitle from "./SectionTitle";
import { motion } from "framer-motion";
import { fadeIn, scale, staggerContainer } from "../utils/motion";
import backgroundTestimonials from "../../assets/images/bg-testimonials.svg";
import blankAvatar from "../../assets/images/blank-avatar.jpg";

const TestimonialsSection = () => {
  const testimonialsCards = [
    {
      avatar: "",
      name: "John Doe",
      date: "JAN 18, 2025",
      message:
        "ThinkFlow has changed the way I take notes. It's so much faster and more efficient!",
    },
    {
      avatar: "",
      name: "Jane Smith",
      date: "FEB 20, 2025",
      message:
        "I just received an invite to ThinkFlow, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses",
    },
    {
      avatar: "",
      name: "John Doe",
      date: "JAN 18, 2025",
      message:
        "I just received an invite to ThinkFlow, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses",
    },
    {
      avatar: "",
      name: "Jane Smith",
      date: "FEB 20, 2025",
      message:
        "I just received an invite to ThinkFlow, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses",
    },
    {
      avatar: "",
      name: "John Doe",
      date: "JAN 18, 2025",
      message:
        "ThinkFlow has changed the way I take notes. It's so much faster and more efficient!",
    },
    {
      avatar: "",
      name: "Jane Smith",
      date: "FEB 20, 2025",
      message:
        "I just received an invite to ThinkFlow, and holy crap! It is well thought out, and I can see this being my note-taking platform going forward. Well done! I'm looking forward to seeing how the app progresses",
    },
  ];

  return (
    <motion.section
      variants={staggerContainer(0.3, 0.5)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative mt-28 px-6 md:mt-[150px]"
      id="testimonials"
    >
      <SectionTitle subTitle="Testimonials" title="What our users say" />
      <motion.img
        variants={fadeIn("up", 0.5)}
        className="absolute top-3/5 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
        src={backgroundTestimonials}
        alt="bg-testimonials"
      />
      <motion.div
        variants={fadeIn("up", 0.6)}
        className="mask-fade mx-auto mt-10 max-h-[680px] max-w-[340px] overflow-hidden md:mt-[60px] md:max-w-[704px] lg:max-w-[1068px]"
      >
        <div className="animate-marquee-vertical columns-1 gap-6 md:columns-2 lg:columns-3">
          {testimonialsCards.map((testimonialCard, index) => (
            <motion.div
              key={index}
              variants={scale(0.3 + index * 0.1)}
              className={`border-gallery mb-6 max-w-[340px] rounded-[10px] border bg-white p-5`}
            >
              <div className="flex items-center gap-2.5 md:gap-3">
                {testimonialCard.avatar ? (
                  <img
                    className="w-10 rounded-full md:w-[46px]"
                    src={testimonialCard.avatar}
                    alt="user-avatar"
                  />
                ) : (
                  <img
                    className="w-10 rounded-full md:w-[46px]"
                    src={blankAvatar}
                    alt="blank-avatar"
                  />
                )}
                <div>
                  <h3 className="font-body text-ebony-clay text-sm font-semibold md:text-base/[22px]">
                    {testimonialCard.name}
                  </h3>
                  <p className="text-gravel font-body mt-0.5 text-[10px] md:mt-1 md:text-xs">
                    {testimonialCard.date}
                  </p>
                </div>
              </div>
              <p className="font-body text-ebony-clay mt-2.5 text-sm/normal md:mt-5 md:text-base/normal">
                {testimonialCard.message}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default TestimonialsSection;
