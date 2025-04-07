import { AuthProvider } from "./AuthContext";
import { EmailVerificationProvider } from "./EmailVerificationContext";
import { ThemeProvider } from "./ThemeContext";

const ContextProvider = (props) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmailVerificationProvider>{props.children}</EmailVerificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default ContextProvider;
