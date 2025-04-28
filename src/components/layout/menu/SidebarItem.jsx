import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { submenuVariants } from "../../../utils/motion";
import { ChevronDown } from "lucide-react";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import union from "../../../assets/images/union.svg";
import unionDark from "../../../assets/images/union-dark.svg";

const SidebarItem = ({
  item,
  index,
  isExpanded,
  openSubmenu,
  setOpenSubmenu,
}) => {
  const isCurrentPage = item.to && location.pathname === item.to;
  const isChildActive = item.children?.find((child) =>
    location.pathname.startsWith(child.to),
  );

  const { theme } = useContext(ThemeContext);

  const Wrapper = item.to ? NavLink : "div";

  return (
    <div className={`${isExpanded ? "" : "relative"}`}>
      <Wrapper
        {...(item.to ? { to: item.to } : {})}
        onClick={() => {
          if (!item.to) {
            setOpenSubmenu(openSubmenu === index ? null : index);
          }
        }}
        data-tooltip-id={`item-tooltip-${index}`}
        data-tooltip-content={item.label}
        className={
          item.to
            ? ({ isActive }) => {
                return `group flex items-center rounded-xl px-4 py-3 transition-all duration-300 ease-in-out ${
                  isActive || isChildActive || openSubmenu === index
                    ? "bg-cornflower-blue/10"
                    : ""
                }`;
              }
            : `group flex cursor-pointer items-center rounded-xl px-4 py-3 transition-all duration-300 ease-in-out ${
                isChildActive || openSubmenu === index
                  ? "bg-cornflower-blue/10"
                  : ""
              }`
        }
      >
        <item.icon
          className={`group-hover:text-white mr-4 h-5 w-5 min-w-5 transition-all duration-300 ease-in-out group-hover:stroke-2 dark:group-hover:text-white ${openSubmenu === index || isCurrentPage || isChildActive ? "text-white stroke-2 " : "text-white stroke-[1.5]"}`}
        />
        <span
          className={`font-body group-hover:text-white overflow-hidden text-base whitespace-nowrap transition-all duration-300 ease-in-out group-hover:font-semibold dark:group-hover:text-white ${openSubmenu === index || isCurrentPage || isChildActive ? "text-white font-semibold " : "text-white"} ${isExpanded ? "w-32" : "w-0"}`}
        >
          {item.label}
        </span>
        {item.children && isExpanded && (
          <ChevronDown
            className={`group-hover:text-white ml-auto h-5 w-5 transition-all duration-300 ease-in-out group-hover:stroke-2 dark:group-hover:text-white ${isChildActive || isCurrentPage ? (openSubmenu === index ? "text-white rotate-180 stroke-2 " : "text-white rotate-0 stroke-2 ") : openSubmenu === index ? "text-white rotate-180 stroke-2 " : "text-white rotate-0 stroke-[1.5]"}`}
          />
        )}
        {!isExpanded && (
          <Tooltip
            id={`item-tooltip-${index}`}
            place="right"
            style={{
              backgroundColor: "#6368d1",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            }}
            className="font-body"
          />
        )}
      </Wrapper>

      {item.children && (
        <motion.div
          initial="hidden"
          animate={openSubmenu === index ? "visible" : "hidden"}
          variants={submenuVariants}
          className="ml-[25px] flex items-start overflow-hidden"
        >
          <img
            src={theme === "light" ? union : unionDark}
            alt="union"
            className="mb-7 h-[88px]"
          />

          {isExpanded ? (
            <div className="mt-3 mb-2 flex w-full flex-col gap-1">
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.to}
                  className={({ isActive }) => {
                    return `font-body hover:text-white cursor-pointer rounded-xl px-4 py-2.5 text-base whitespace-nowrap transition-all duration-300 ease-in-out hover:font-semibold dark:hover:text-white ${
                      isActive
                        ? "bg-cornflower-blue/10 text-white font-semibold "
                        : "text-white"
                    }`;
                  }}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-12 left-14 flex w-40 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-[0px_1px_8px_rgba(39,35,64,0.1)] dark:border-gray-100/20 dark:bg-[#16163B]"
            >
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.to}
                  className={({ isActive }) => {
                    return `font-body hover:text-white cursor-pointer rounded-xl px-4 py-2.5 text-base whitespace-nowrap transition-all duration-300 ease-in-out hover:font-semibold dark:hover:text-white ${
                      isActive
                        ? "bg-cornflower-blue/10 text-white font-semibold "
                        : "text-white"
                    }`;
                  }}
                >
                  {child.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SidebarItem;
