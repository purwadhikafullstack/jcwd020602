import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import "./css/app.css";
import "./css/dashboard.css";
import { routes } from "./routes/routess";

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
