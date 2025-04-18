export const fadeIn = (direction, delay, hidden = false) => {
  return {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: hidden ? "-100%" : 0,
      x: 0,
      opacity: hidden ? 0 : 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };
};

export const getNavbarStyles = (hidden, scrollYValue, isMenuOpen, theme) => {
  const applyStyles = (scrollYValue === 0 || hidden) && !isMenuOpen;
  return {
    backgroundColor: applyStyles
      ? "transparent"
      : theme === "light"
        ? "white"
        : "#0A0930",
    borderBottom: applyStyles
      ? "1px solid transparent"
      : theme === "light"
        ? "1px solid #EEEEEE"
        : "1px solid rgb(255, 255, 255, 0.1)",
    paddingTop: applyStyles ? "0px" : "6px",
    paddingBottom: applyStyles ? "0px" : "6px",
    transition: "background-color 0.3s ease-in-out, padding 0.3s ease-in-out",
  };
};

export const staggerContainer = (staggerChildren, delayChildren) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

export const textVariant = (delay) => {
  return {
    hidden: {
      y: 50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay,
      },
    },
  };
};

export const slideIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      opacity: 0,
      x: direction === "left" ? "-50px" : direction === "right" ? "50px" : 0,
      y: direction === "up" ? "50px" : direction === "down" ? "-50px" : 0,
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: "easeOut",
      },
    },
  };
};

export const scale = (delay) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay,
      },
    },
  };
};

export const getSidebarStyles = (isExpanded) => ({
  width: isExpanded ? "281px" : "101px",
  transition: "width 0.3s ease-in-out",
});

export const submenuVariants = {
  hidden: { maxHeight: 0, opacity: 0 },
  visible: {
    maxHeight: 120,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export const getTopbarStyles = (isExpanded) => ({
  left: isExpanded ? 281 : 101,
  transition: "left 0.3s ease-in-out",
});

export const audioExpandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};
