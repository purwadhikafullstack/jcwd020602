import { createContext, useEffect, useState } from "react";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import "./css/app.css";
import "./css/dashboard.css";

export const ThemeContext = createContext(null);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => {
      const newTheme = curr == "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const themeNow = localStorage.getItem("theme");
    if (themeNow) {
      setTheme(themeNow);
    }
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
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <div id={theme}>
            <Routes>{routes.map((val) => val)}</Routes>
          </div>
        </ThemeContext.Provider>
      )}
    </>
  );
}

export default App;
