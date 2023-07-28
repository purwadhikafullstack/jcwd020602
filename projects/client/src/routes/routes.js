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
import CategoryPage from "../pages/categoryPage";
import SubcategoryPage from "../pages/Subcategory";
import ProductPage from "../pages/productPage";
import StockHistoryPage from "../pages/stockHistoryPage";
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
        <ProductPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/category"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <CategoryPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/subcategory"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <SubcategoryPage />
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
    path="/stock"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <InventoryPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/stockHistory"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <StockHistoryPage />
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
