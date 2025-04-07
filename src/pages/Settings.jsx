import { Bell, Shield, Settings2, UserRound } from "lucide-react";
import Profile from "../components/ui/ProfileForm";
import { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Info", icon: UserRound },
    { id: "preferences", label: "Preferences", icon: Settings2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="flex h-full justify-center">
      <div className="flex h-fit w-52 flex-col">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(tab.id)}
            className={`flex cursor-pointer items-center gap-2.5 rounded-tl-md rounded-bl-md px-6 py-5 ${activeTab === tab.id ? "bg-white dark:bg-[#16163B]" : ""}`}
          >
            <tab.icon
              className={`h-5 w-5 transition-all duration-300 ease-in-out ${activeTab === tab.id ? "text-indigo stroke-2 dark:text-white" : "text-gravel stroke-[1.5]"}`}
            />
            <span
              className={`font-body text-base whitespace-nowrap transition-all duration-300 ease-in-out ${activeTab === tab.id ? "text-indigo font-semibold dark:text-white" : "text-gravel"}`}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      <div className="w-3xl items-center px-20 flex justify-center rounded-tr-md rounded-br-md bg-white dark:bg-[#16163B]">
        {activeTab === "personal" && <Profile />}
      </div>
    </div>
  );
};

export default Settings;
