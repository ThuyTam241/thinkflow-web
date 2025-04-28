import logo from "../../assets/images/logo.svg";
import IconButton from "../ui/buttons/IconButton";
import { motion } from "framer-motion";
import { getSidebarStyles } from "../../utils/motion";
import { Link, useLocation } from "react-router";
import { LogOut, Moon, Sun } from "lucide-react";
import Avatar from "../ui/Avatar";
import { logoutApi } from "../../services/api.service";
import notify from "../ui/CustomToast";
import SidebarItem from "./menu/SidebarItem";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ menuItems, extraItems, isExpanded }) => {
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

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
      initial="hidden"
      animate="show"
      style={getSidebarStyles(isExpanded)}
      className="bg-ebony-clay fixed top-0 left-0 z-10 h-screen dark:bg-[#16163B]"
    >
      <nav className="border-r-gray-200/20 flex h-full flex-col border-r px-6">
        <Link
          to="/"
          className={`mt-6 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "w-full" : "w-12"}`}
        >
          <img src={logo} alt="logo" className="h-10 max-w-none" />
        </Link>

        <div className="flex flex-col gap-2 py-6">
          {menuItems.map((menuItem, index) => (
            <SidebarItem
              key={index}
              item={menuItem}
              index={index}
              isExpanded={isExpanded}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
            />
          ))}
        </div>

        <div className="border-t-gray-200/20 flex flex-col gap-2 border-t py-6">
          {extraItems.map((extraItem, index) => (
            <SidebarItem
              key={index}
              item={extraItem}
              index={index + menuItems.length}
              isExpanded={isExpanded}
              openSubmenu={openSubmenu}
              setOpenSubmenu={setOpenSubmenu}
            />
          ))}
        </div>

        <div className="mt-auto flex flex-col items-center justify-center">
          <div
            className={`flex h-10 cursor-pointer justify-between ${isExpanded ? "w-20" : "w-fit"} bg-cornflower-blue/10 items-center rounded-full p-1 transition-all duration-300 ease-in-out`}
            onClick={toggleTheme}
          >
            {isExpanded ? (
              <>
                <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                  <IconButton
                    customStyle={
                      theme === "light"
                        ? "text-white stroke-2"
                        : "text-silver-chalice  stroke-1"
                    }
                    size="w-5 h-5"
                    icon={Sun}
                    onClick={toggleTheme}
                  />
                </div>

                <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                  <IconButton
                    customStyle={
                      theme === "dark"
                        ? "text-white stroke-2"
                        : "text-silver-chalice  stroke-1"
                    }
                    size="w-5 h-5"
                    icon={Moon}
                    onClick={toggleTheme}
                  />
                </div>

                <div
                  className={`bg-cornflower-blue/80 absolute h-8 w-8 rounded-full transition-transform duration-300 ease-in-out ${
                    theme === "dark" && isExpanded
                      ? "translate-x-10"
                      : "translate-x-0"
                  }`}
                />
              </>
            ) : (
              <>
                <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                  <IconButton
                    customStyle="text-white stroke-[1.5]"
                    size="w-5 h-5"
                    icon={theme === "dark" ? Moon : Sun}
                    onClick={toggleTheme}
                  />
                </div>

                <div className="bg-cornflower-blue/80 absolute h-8 w-8 rounded-full" />
              </>
            )}
          </div>

          <div className="border-t-gray-200/20 mt-6 w-full flex cursor-pointer overflow-hidden border-t py-6">
            <Avatar
              className="mr-3 h-11 w-11 rounded-full"
              src={user?.avatar?.url}
            />
            <div
              className={`flex items-center justify-between transition-all duration-300 ease-in-out ${isExpanded ? "w-full" : "w-0"}`}
            >
              <div className="flex flex-col justify-between">
                <h4 className="font-body text-white text-sm whitespace-nowrap">
                  Welcome back 👋🏼
                </h4>
                <span className="font-body text-white text-base font-semibold whitespace-nowrap">
                  {user.first_name}
                </span>
              </div>
              <IconButton
                customStyle="text-white stroke-[1.5]"
                size="w-5 h-5"
                icon={LogOut}
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
