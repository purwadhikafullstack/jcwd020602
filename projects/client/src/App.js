import { useEffect, useState } from "react";
// import routes from "./routes/routes";
import { Route, Routes } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import "./css/app.css";
import "./css/dashboard.css";
import { routes } from "./routes/routess";

// function App() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 3000);
//   }, [isLoading]);

//   return (
//     <>
//       {isLoading ? (
//         <Center h={"100vh"}>
//           <Spinner />
//         </Center>
//       ) : (
//         <Routes>{routes.map((val) => val)}</Routes>
//       )}
//     </>
//   );
// }

function App() {
  return (
    <Routes>
      {routes.map((route, i) => (
        <Route {...route} key={i} />
      ))}
    </Routes>
  );
}

export default App;
