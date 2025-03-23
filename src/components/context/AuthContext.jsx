import { createContext, useState } from "react";

export const AuthContext = createContext({
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
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    avatar: "",
    gender: "",
    system_role: "",
    status: "",
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
};
