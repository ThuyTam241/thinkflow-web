import { useContext, useState } from "react";
import { LogOut } from "lucide-react";
import IconButton from "../../components/ui/buttons/IconButton"
import logo from "../../assets/images/logo.svg";
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
  const [users, setUsers] = useState([]);
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
    <div className="min-h-screen">
      <div className="flex items-center justify-between border-b border-b-gray-200 px-6 py-4 dark:border-b-gray-100/20">
        <div className="flex flex-1 items-center gap-2">
          <img src={logo} alt="logo" className="h-10 max-w-none" />
        </div>
        <div className="flex flex-1 justify-center">
          <span className="font-body text-ebony-clay flex items-center gap-2 text-xl font-bold">
            Hello {user.last_name} {user.first_name}{" "}
            <span role="img" aria-label="wave">
              👋🏻
            </span>
          </span>
        </div>
        <div className="flex flex-1 justify-end">
          <IconButton icon={LogOut} onClick={logout} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <Statistic users={users} />
        <UserManagement users={users} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default Dashboard;
