import { Outlet } from "react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import {
  WandSparkles,
  Notebook,
  Archive,
  Settings,
  CircleHelp,
} from "lucide-react";
import TopBar from "../../components/layout/TopBar";

const Workspace = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState("");

  const menuItems = [
    {
      icon: Notebook,
      label: "My Notes",
      children: [
        { to: "/workspace/my-notes/text-notes", label: "Text Notes" },
        { to: "/workspace/my-notes/audio-notes", label: "Audio Notes" },
      ],
    },
    {
      to: "/workspace/ai-mind-maps",
      icon: WandSparkles,
      label: "AI Mind Maps",
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
    <div className="bg-hawkes-blue/30 flex h-screen w-screen overflow-hidden dark:bg-[#0A0930]">
      <Sidebar
        menuItems={menuItems}
        extraItems={extraItems}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        setSelectedLabel={setSelectedLabel}
      />
      <motion.div
        initial={{ marginLeft: 281 }}
        animate={{ marginLeft: isExpanded ? 281 : 101 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="mt-16 flex flex-1 flex-col p-6"
      >
        <TopBar isExpanded={isExpanded} title={selectedLabel} />
        <Outlet />
      </motion.div>
    </div>
  );
};

export default Workspace;
