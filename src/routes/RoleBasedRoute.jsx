import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { Navigate, Outlet } from "react-router";
import { RingLoader } from "react-spinners";

const RoleBasedRoute = ({ isAllowed }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RingLoader color="#6368d1" size={100} />
      </div>
    );
  }

  if (user?.id && isAllowed.includes(user.system_role)) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};

export default RoleBasedRoute;
