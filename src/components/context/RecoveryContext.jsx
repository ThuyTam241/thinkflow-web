import { createContext, useState } from "react";

export const RecoveryContext = createContext("");

export const RecoveryProvider = (props) => {
  const [email, setEmail] = useState("");

  return (
    <RecoveryContext.Provider value={{ email, setEmail }}>
      {props.children}
    </RecoveryContext.Provider>
  );
};
