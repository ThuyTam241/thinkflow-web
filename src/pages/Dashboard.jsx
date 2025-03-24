import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { logoutApi } from "../services/api.service";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    const res = await logoutApi();
    if (res.data) {
      navigate("/login");
    } else {
      toast("logout fail")
    }
  };

  return (
    <div>
      <h1>{user.first_name}</h1>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Dashboard;
