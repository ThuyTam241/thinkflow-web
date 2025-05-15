import { Outlet } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import {
  Notebook,
  Archive,
  Settings,
  CircleHelp,
  Bell,
} from "lucide-react";

const Workspace = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    {
      icon: Notebook,
      label: "My Notes",
      children: [
        { to: "/workspace/notes/my-notes", label: "Notes" },
        { to: "/workspace/notes/shared-notes", label: "Shared with me" },
      ],
    },
    {
      to: "/notifications",
      icon: Bell,
      label: "Notifications"
    },
    {
      to: "/workspace/archived",
      icon: Archive,
      label: "Archived",
    },
  ];

  const extraItems = [
    { to: "/workspace/settings", icon: Settings, label: "Settings" },
    { to: "/workspace/support", icon: CircleHelp, label: "Support" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        menuItems={menuItems}
        extraItems={extraItems}
        isExpanded={isExpanded}
      />
      <motion.div
        initial={{ marginLeft: 261 }}
        animate={{ marginLeft: isExpanded ? 261 : 101 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-1 flex-col"
      >
        <Outlet context={{isExpanded, setIsExpanded}} />
      </motion.div>
    </div>
  );
};

export default Workspace;
