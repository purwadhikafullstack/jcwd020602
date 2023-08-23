import { createContext, useEffect, useState } from "react";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import "./css/app.css";
import "./css/dashboard.css";

export const ThemeContext = createContext(null);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Center h={"100vh"}>
          <Spinner />
        </Center>
      ) : (
        <Routes>{routes.map((val) => val)}</Routes>
      )}
    </>
  );
}

export default App;
