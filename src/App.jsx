import { useContext } from "react";
import LandingPage from "./pages/Landing";
import { AuthContext } from "./components/context/AuthContext";
import { PuffLoader } from "react-spinners";

function App() {
  const { isLoading } = useContext(AuthContext);

  return (
    <>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <PuffLoader color="#6368d1" size={100} />
        </div>
      ) : (
        <div>
          <LandingPage />
        </div>
      )}
    </>
  );
}

export default App;
