import { Route } from "react-router-dom";
import LandingPage from "../pages/landingPage";
import ProtectedPage from "./protectedPage";
import Dashboard from "../pages/dashboard";
import AuthForm from "../pages/authPage";
import Verify from "../components/auth/registerVerif";
const routes = [
  <Route
    path="/"
    element={
      <ProtectedPage>
        <LandingPage />
      </ProtectedPage>
    }
  />,

  <Route path="/auth" element={<AuthForm />} />,
  <Route path="/verify/:token" element={<Verify />} />,
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
