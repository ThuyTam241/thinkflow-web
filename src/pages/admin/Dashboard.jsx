import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { logoutApi } from "../../services/api.service";
import notify from "../../components/ui/CustomToast";

const Dashboard = () => {

  const { user, setUser } = useContext(AuthContext);

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
    <div>
      <h1>Dashboard {user.first_name}</h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Dashboard;
