import { createContext, useEffect, useState } from "react";
import { getUserProfileApi } from "../../services/api.service";

export const AuthContext = createContext({
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

export const AuthProvider = (props) => {
  const [user, setUser] = useState({
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

  const [isLoading, setIsLoading] = useState(true);

  const getUserProfile = async () => {
    const user = await getUserProfileApi();
    if (user.data) {
      const { created_at, updated_at, ...profile } = user.data;
      setUser(profile);
    }
  };

  const checkAuth = async () => {
    await getUserProfile();
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, getUserProfile }}>
      {props.children}
    </AuthContext.Provider>
  );
};
