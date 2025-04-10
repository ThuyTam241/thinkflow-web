import logo from "../../assets/images/logo.svg";
import chevronLeft from "../../assets/icons/chevron-left.svg";
import chevronRight from "../../assets/icons/chevron-right.svg";
import chevronLeftDark from "../../assets/icons/chevron-left-dark.svg";
import chevronRightDark from "../../assets/icons/chevron-right-dark.svg";
import IconButton from "../ui/buttons/IconButton";
import { motion } from "framer-motion";
import { getSidebarStyles, slideIn } from "../../utils/motion";
import { Link, useLocation } from "react-router";
import { LogOut } from "lucide-react";
import Avatar from "../ui/Avatar";
import { logoutApi } from "../../services/api.service";
import notify from "../ui/CustomToast";
import SidebarItem from "./menu/SidebarItem";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({
  menuItems,
  extraItems,
  isExpanded,
  setIsExpanded,
  setSelectedLabel,
}) => {
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { user, setUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (openSubmenu !== null) {
      const isInSubmenu = menuItems[openSubmenu]?.children?.some((child) =>
        location.pathname.startsWith(child.to),
      );

      if (!isInSubmenu) {
        setOpenSubmenu(null);
      }
    }
  }, [isExpanded, location.pathname]);

  const handleLogout = async () => {
    const res = await logoutApi();
    if (res.data) {
      setUser({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        avatar: "",
        gender: "",
        system_role: "",
        status: "",
      });
      notify(
        "success",
        "Logged out successfully!",
        "You have been logged out. See you again soon",
        "var(--color-silver-tree)",
      );
    } else {
      notify(
        "success",
        "Logout failed!",
        "Something went wrong",
        "var(--color-silver-tree)",
      );
    }
  };

  return (
    <motion.aside
      variants={slideIn("left", "spring", 0.2, 1)}
      initial="hidden"
      animate="show"
      style={getSidebarStyles(isExpanded)}
      className="fixed top-0 left-0 z-10 h-screen bg-white dark:bg-[#16163B]"
    >
      <nav className="border-r-gallery flex h-full flex-col border-r px-6">
        <div className="relative flex py-6">
          <Link
            to="/"
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "w-full" : "w-12"}`}
          >
            <img src={logo} alt="logo" className="h-10 max-w-none" />
          </Link>
          <div className="absolute top-12 -right-10 flex items-center justify-center rounded-full shadow-[0px_1px_8px_rgba(39,35,64,0.1)] dark:shadow-[0px_1px_8px_rgba(233,233,233,0.05)]">
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              src={
                theme === "light"
                  ? isExpanded
                    ? chevronLeft
                    : chevronRight
                  : isExpanded
                    ? chevronLeftDark
                    : chevronRightDark
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 py-6">
          {menuItems.map((menuItem, index) => (
            <SidebarItem
              key={index}
              item={menuItem}
              index={index}
              isExpanded={isExpanded}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
              setSelectedLabel={setSelectedLabel}
            />
          ))}
        </div>

        <div className="border-t-gallery flex flex-col gap-2 border-t py-6">
          {extraItems.map((extraItem, index) => (
            <SidebarItem
              key={index}
              item={extraItem}
              index={index + menuItems.length}
              isExpanded={isExpanded}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
              setSelectedLabel={setSelectedLabel}
            />
          ))}
        </div>

        <div className="border-t-gallery mt-auto flex cursor-pointer border-t py-6">
          <Avatar
            className="mr-3 h-11 w-11 rounded-full"
            src={user?.avatar?.url}
          />
          <div
            className={`flex items-center justify-between gap-5 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "w-full" : "w-0"}`}
          >
            <div className="flex flex-col justify-between overflow-hidden">
              <h4 className="font-body text-gravel text-sm whitespace-nowrap">
                Welcome back 👋🏼
              </h4>
              <span className="font-body text-ebony-clay text-base font-semibold whitespace-nowrap">
                {user.first_name}
              </span>
            </div>
            <LogOut
              size={20}
              onClick={handleLogout}
              className="text-ebony-clay cursor-pointer stroke-[1.5]"
            />
          </div>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
