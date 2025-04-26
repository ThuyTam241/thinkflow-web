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
    <div className="my-auto flex justify-center">
      <div className="flex w-52 flex-col">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex cursor-pointer items-center gap-2.5 px-6 py-4"
          >
            <div
              className={`absolute top-0 bottom-0 left-0 h-full w-1 rounded-xs transition-colors duration-300 ease-in-out ${activeTab === tab.id ? "bg-cornflower-blue/80" : "bg-transparent"}`}
            ></div>
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

      <div className="flex w-3xl items-center justify-center px-20">
        {activeTab === "personal" && <Profile />}
      </div>
    </div>
  );
};

export default Settings;
