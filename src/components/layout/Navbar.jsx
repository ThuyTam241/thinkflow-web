import { Link, useNavigate } from "react-router";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { fadeIn, getNavbarStyles } from "../utils/motion";
import logo from "../../assets/images/logo.svg";
import closeIcon from "../../assets/icons/close-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";

const Navbar = () => {
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
  ];

  const [activeLink, setActiveLink] = useState("#home");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrollYValue, setScrollYValue] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    setScrollYValue(latest);
    if (latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navigate = useNavigate();

  return (
    <motion.nav
      variants={fadeIn("down", 0.2, hidden)}
      initial="hidden"
      style={getNavbarStyles(hidden, scrollYValue, isMenuOpen)}
      animate="show"
      className={`fixed top-0 right-0 left-0 z-20 px-2.5 md:px-5 lg:px-10 ${isMenuOpen ? "lg:border-transparent! lg:bg-transparent!" : ""}`}
    >
      <div
        className={`flex h-10 w-full md:h-12 lg:h-14 ${scrollYValue === 0 ? "lg:items-end" : "lg:items-center"}`}
      >
        {/* navbar items */}
        <div className="hidden gap-7 lg:flex">
          {navLinks.map((navLink, index) => (
            <a
              key={index}
              href={navLink.href}
              onClick={() => setActiveLink(navLink.href)}
              className={`font-body text-gravel hover:text-ebony-clay text-base/[22px] transition-all duration-300 ease-in-out hover:font-semibold ${
                activeLink === navLink.href
                  ? "text-ebony-clay! font-semibold!"
                  : ""
              }`}
            >
              {navLink.label}
            </a>
          ))}
        </div>

        {/* logo */}
        <div className="my-auto lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Link to="/">
            <img src={logo} alt="logo" className="h-8 md:h-9 lg:h-auto" />
          </Link>
        </div>

        {/* btn */}
        <div className="ml-auto hidden gap-5 lg:flex">
          <PrimaryButton
            onClick={() => navigate("/login")}
            color="white"
            label="Sign In"
          />
          <PrimaryButton
            onClick={() => navigate("/register")}
            color="blue"
            label="Sign Up"
          />
        </div>

        {/* menu icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto lg:hidden"
        >
          {isMenuOpen ? (
            <img className="h-7 w-7" src={closeIcon} alt="menu-icon" />
          ) : (
            <img className="h-7 w-7" src={menuIcon} alt="menu-icon" />
          )}
        </button>
      </div>

      {/* menu items */}
      {isMenuOpen && (
        <div className="my-1 lg:hidden">
          {navLinks.map((navLink, index) => (
            <a
              key={index}
              href={navLink.href}
              onClick={() => setActiveLink(navLink.href)}
              className={`font-body text-gravel hover:text-ebony-clay block py-1.5 text-center text-sm transition-all duration-300 ease-in-out hover:font-semibold md:py-2 md:text-base/[22px] ${
                activeLink === navLink.href
                  ? "text-ebony-clay! font-semibold!"
                  : ""
              }`}
            >
              {navLink.label}
            </a>
          ))}
          <div className="flex justify-center gap-3 py-3">
            <PrimaryButton
              onClick={() => navigate("/login")}
              color="white"
              label="Sign In"
            />
            <PrimaryButton
              color="blue"
              label="Sign Up"
              onClick={() => navigate("/register")}
            />
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
