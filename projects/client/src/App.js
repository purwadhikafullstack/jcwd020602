import { useEffect, useState } from "react";
import Navbar from "./components/website/navbar";
import routes from "./routes/routes";
import { Routes } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import "./css/app.css";
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  });
  return (
    <>
      <Navbar />
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
