import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>{user.first_name}</h1>
    </div>
  );
};

export default Dashboard;