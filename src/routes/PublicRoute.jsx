import { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { Navigate, Outlet } from "react-router";
import { RingLoader } from "react-spinners";

const PublicRoute = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RingLoader color="#6368d1" size={100} />
      </div>
    );
  }

  if (user?.id) {
    return <Navigate to={user.system_role === "user" ? "/workspace" : "/dashboard"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
