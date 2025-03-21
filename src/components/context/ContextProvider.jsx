import { RecoveryProvider } from "./RecoveryContext";

const ContextProvider = (props) => {
  return (
    // <AuthProvider>
    <RecoveryProvider>{props.children}</RecoveryProvider>
    // </AuthProvider>
  );
};

export default ContextProvider;
