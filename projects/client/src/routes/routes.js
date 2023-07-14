import { Route } from "react-router-dom";
import LandingPage from "../pages/landingPage";
import ProtectedPage from "./protectedPage";
import Dashboard from "../pages/dashboard";
const routes = [
  <Route
    path="/"
    element={
      <ProtectedPage>
        <LandingPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/login"
    element={<ProtectedPage>{/* loginpage */}</ProtectedPage>}
  />,
  <Route
    path="/signup"
    element={<ProtectedPage>{/* signuppage */}</ProtectedPage>}
  />,
  <Route
    path="/dashboard"
    element={
      <ProtectedPage guestOnly={false} needLogin={true}>
        <Dashboard />
      </ProtectedPage>
    }
  />,
];

export default routes;
