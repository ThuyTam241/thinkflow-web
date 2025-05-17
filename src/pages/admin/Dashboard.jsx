import { useContext } from "react";
import { LogOut, Hexagon } from "lucide-react";

import { AuthContext } from "../../components/context/AuthContext";
import { logoutApi } from "../../services/api.service";
import notify from "../../components/ui/CustomToast";
import Statistic from "./Statistic";
import UserManagement from "./UserManagement";

const nonLoginUser = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  avatar: "",
  gender: "",
  system_role: "",
  status: "",
}

function notifyLogoutSuccess() {
  notify(
    "success",
    "Logged out successfully!",
    "You have been logged out. See you again soon",
    "var(--color-silver-tree)",
  );
}

function notifyLogoutFailed() {
  notify(
    "success",
    "Logout failed!",
    "Something went wrong",
    "var(--color-silver-tree)",
  );
}

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);

  const logout = async () => {
    const res = await logoutApi();
    if (res.data) {
      setUser(nonLoginUser);
      notifyLogoutSuccess();
    } else {
      notifyLogoutFailed();
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-200 bg-white px-6 py-4">
        {/* Left: Logo + Dashboard */}
        <div className="flex items-center gap-2 flex-1">
          <Hexagon className="w-8 h-8 text-black" strokeWidth={2.5} />
          <span className="font-bold text-2xl text-black">Dashboard</span>
          <span className="text-xs text-gray-400 ml-1 self-end mb-1">v.01</span>
        </div>
        {/* Center: Hello admin */}
        <div className="flex-1 flex justify-center">
          <span className="text-xl font-semibold text-black flex items-center gap-2">
            Hello {user.last_name} {user.first_name} <span role="img" aria-label="wave">👋🏻</span>
          </span>
        </div>
        {/* Right: Logout icon */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Statistic />
        <UserManagement />
      </div>
    </div>
  );
};

export default Dashboard;
