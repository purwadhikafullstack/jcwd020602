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
import BrandPage from "../pages/brandPage";
import ProfilePage from "../pages/profilePage";
import ForgotPassword from "../components/auth/forgotPassword";
import ChangePassword from "../components/auth/changePassword";
import ProductList from "../pages/productList";
import ProductDetailPage from "../pages/productDetailPage";

import Cart from "../pages/cartPages";

import StockMutationPage from "../pages/stockMutationPage";

import CheckOutPage from "../pages/checkOutPage";
import PaymentVerifPage from "../pages/paymentPage";

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
  <Route
    path="/profile"
    element={
      <ProtectedPage guestOnly={true} needLogin={true}>
        <Navbar />
        <ProfilePage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/forgot-password"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ForgotPassword />
      </ProtectedPage>
    }
  />,
  <Route
    path="/forgot-password/:token"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ChangePassword />
      </ProtectedPage>
    }
  />,
  <Route
    path="/c/:category"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ProductList />
      </ProtectedPage>
    }
  />,
  <Route
    path="/b/:brand"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ProductList />
      </ProtectedPage>
    }
  />,
  <Route
    path="/c/:category/:sub"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ProductList />
      </ProtectedPage>
    }
  />,
  <Route
    path="/shoes"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ProductList />
      </ProtectedPage>
    }
  />,
  <Route
    path="/:product_name"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <ProductDetailPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/cart"
    element={
      <ProtectedPage guestOnly={true}>
        <Navbar />
        <Cart />
      </ProtectedPage>
    }
  />,

  <Route
    path="/checkOut"
    element={
      <>
        <Navbar />
        <CheckOutPage />
      </>
    }
  />,
  <Route
    path="/payment"
    element={
      <>
        <Navbar />
        <PaymentVerifPage />
      </>
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
    path="/brand"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <BrandPage />
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
    path="/stockMutation"
    element={
      <ProtectedPage needLogin={true} guestOnly={false}>
        <NavbarDashboard />
        <Sidebar />
        <StockMutationPage />
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
