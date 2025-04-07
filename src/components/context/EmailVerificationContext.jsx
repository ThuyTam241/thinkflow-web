import { createContext, useEffect, useState } from "react";

export const EmailVerificationContext = createContext("");

export const EmailVerificationProvider = (props) => {
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  return (
    <EmailVerificationContext.Provider value={{ email, setEmail }}>
      {props.children}
    </EmailVerificationContext.Provider>
  );
};
