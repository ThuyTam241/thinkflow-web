import { motion } from "framer-motion";
import { fadeIn, getTopbarStyles } from "../../utils/motion";
import SearchBar from "../ui/SearchBar";
import { ListFilter, Moon, Sun } from "lucide-react";
import IconButton from "../ui/buttons/IconButton";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const TopBar = ({ isExpanded, title }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.div
      variants={fadeIn("down", 0.2)}
      initial="hidden"
      animate="show"
      style={getTopbarStyles(isExpanded)}
      className="border-b-gallery fixed top-0 right-0 flex h-16 items-center border-b bg-white px-6 dark:bg-[#16163B]"
    >
      <h1 className="font-body text-ebony-clay text-xl font-semibold">
        {title}
      </h1>
      <div className="ml-auto flex items-center">
        <div className="flex items-center gap-3">
          <SearchBar />
          <IconButton size="w-5 h-5" icon={ListFilter} />
        </div>
        <div className="bg-gallery mx-6 h-6 w-[1px]"></div>
        {theme === "light" ? (
          <IconButton icon={Moon} onClick={toggleTheme} />
        ) : (
          <IconButton icon={Sun} onClick={toggleTheme} />
        )}
      </div>
    </motion.div>
  );
};

export default TopBar;
