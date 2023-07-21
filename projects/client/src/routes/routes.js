import AuthForm from "../pages/authPage";
import Verify from "../components/auth/registerVerif";
import { Route } from "react-router-dom";
import LandingPage from "../pages/landingPage";
import ProtectedPage from "./protectedPage";
import Dashboard from "../pages/dashboard";
import Navbar from "../components/website/navbar";
import NavbarDashboard from "../components/dashboard/navbarDashboard";
import Sidebar from "../components/dashboard/sidebar";
import UserSettingsPage from "../pages/userSettingsPage";
import WarehousePage from "../pages/warehousePage";
import InventoryPage from "../pages/inventoryPage";
const routes = [
  <Route
    path="/"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <LandingPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/auth"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <AuthForm />
      </ProtectedPage>
    }
  />,
  <Route
    path="/verify/:token"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <Verify />
      </ProtectedPage>
    }
  />,
  //------------------------------------- admin
  <Route
    path="/dashboard"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <Dashboard />
      </ProtectedPage>
    }
  />,
  <Route
    path="/product"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        {/*  */}
      </ProtectedPage>
    }
  />,
  <Route
    path="/categories"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        {/*  */}
      </ProtectedPage>
    }
  />,
  <Route
    path="/warehouse"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <WarehousePage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/inventory"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <InventoryPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/report"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        {/*  */}
      </ProtectedPage>
    }
  />,
  <Route
    path="/userSettings"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <UserSettingsPage />
      </ProtectedPage>
    }
  />,
];

export default routes;
