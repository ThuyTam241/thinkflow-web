import { AuthProvider } from "./AuthContext";
import { EmailVerificationProvider } from "./EmailVerificationContext";

const ContextProvider = (props) => {
  return (
    <AuthProvider>
      <EmailVerificationProvider>{props.children}</EmailVerificationProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
