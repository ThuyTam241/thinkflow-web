import { createContext, useState } from "react";

export const EmailVerificationContext = createContext("");

export const EmailVerificationProvider = (props) => {
  const [email, setEmail] = useState("");

  return (
    <EmailVerificationContext.Provider value={{ email, setEmail }}>
      {props.children}
    </EmailVerificationContext.Provider>
  );
};
