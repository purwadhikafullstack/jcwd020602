import { Center, Spinner } from "@chakra-ui/react";
import { Suspense, lazy } from "react";
import ProtectedPage from "./protectedPage";
import FaqPage from "../pages/faqPage";

const LandingPage = lazy(() => import("../pages/landingPage"));
const AuthForm = lazy(() => import("../pages/authPage"));
const Verify = lazy(() => import("../components/auth/registerVerif"));
const ForgotPassword = lazy(() => import("../components/auth/forgotPassword"));
const ChangePassword = lazy(() => import("../components/auth/changePassword"));
const MyAccountPage = lazy(() => import("../pages/MyAccountPage"));
const AddressBookPage = lazy(() => import("../pages/addressBookPage"));
const ProfilePage = lazy(() => import("../pages/profilePage"));
const ProductList = lazy(() => import("../pages/productList"));
const ProductDetailPage = lazy(() => import("../pages/productDetailPage"));
const CheckOutPage = lazy(() => import("../pages/checkoutPage"));
const Cart = lazy(() => import("../pages/cartPage"));
const OrderListUser = lazy(() => import("../pages/orderListUserPage"));
const Dashboard = lazy(() => import("../pages/dashboard"));
const ProductPage = lazy(() => import("../pages/productPage"));
const BrandPage = lazy(() => import("../pages/brandPage"));
const CategoryPage = lazy(() => import("../pages/categoryPage"));
const SubcategoryPage = lazy(() => import("../pages/Subcategory"));
const WarehousePage = lazy(() => import("../pages/warehousePage"));
const InventoryPage = lazy(() => import("../pages/inventoryPage"));
const StockHistoryPage = lazy(() => import("../pages/stockHistoryPage"));
const StockMutationPage = lazy(() => import("../pages/stockMutationPage"));
const OrderListPage = lazy(() => import("../pages/orderList"));
const SalesReportPage = lazy(() => import("../pages/salesReport"));
const UserSettingsPage = lazy(() => import("../pages/userSettingsPage"));

class RouteClass {
  constructor(
    path,
    element,
    guestOnly = false,
    userOnly = false,
    staffOnly = false
  ) {
    this.path = path;
    this.element = (
      <ProtectedPage
        guestOnly={guestOnly}
        userOnly={userOnly}
        staffOnly={staffOnly}
      >
        <Suspense
          fallback={
            <Center h={"100vh"}>
              <Spinner />
            </Center>
          }
        >
          {element}
        </Suspense>
      </ProtectedPage>
    );
  }
}

export const routes = [
  new RouteClass("/", <LandingPage />, true, false, false),
  new RouteClass("/support/faq", <FaqPage />, true, false, false),
  new RouteClass("/auth", <AuthForm />, true, false, false),
  new RouteClass("/verify/:token", <Verify />, true, false, false),
  new RouteClass("/forgot-password", <ForgotPassword />, true, false, false),
  new RouteClass(
    "/forgot-password/:token",
    <ChangePassword />,
    true,
    false,
    false
  ),
  new RouteClass("/my-account", <MyAccountPage />, false, true, false),
  new RouteClass(
    "/my-account/order-list",
    <OrderListUser />,
    false,
    true,
    false
  ),
  new RouteClass(
    "/my-account/address-book",
    <AddressBookPage />,
    false,
    true,
    false
  ),
  new RouteClass("/my-account/profile", <ProfilePage />, false, true, false),
  new RouteClass("/shoes", <ProductList />, true, false, false),
  new RouteClass("/search", <ProductList />, true, false, false),
  new RouteClass("/:product_name", <ProductDetailPage />, true, false, false),
  new RouteClass("/b/:brand", <ProductList />, true, false, false),
  new RouteClass("/c/:category", <ProductList />, true, false, false),
  new RouteClass("/c/:category/:sub", <ProductList />, true, false, false),
  new RouteClass("/cart", <Cart />, false, true, false),
  new RouteClass("/checkOut", <CheckOutPage />, false, true, false),
  //------------------------------------- admin
  new RouteClass("/dashboard", <Dashboard />, false, false, true),
  new RouteClass("/product", <ProductPage />, false, false, true),
  new RouteClass("/brand", <BrandPage />, false, false, true),
  new RouteClass("/category", <CategoryPage />, false, false, true),
  new RouteClass("/subcategory", <SubcategoryPage />, false, false, true),
  new RouteClass("/warehouse", <WarehousePage />, false, false, true),
  new RouteClass("/stock", <InventoryPage />, false, false, true),
  new RouteClass("/stockHistory", <StockHistoryPage />, false, false, true),
  new RouteClass("/stockMutation", <StockMutationPage />, false, false, true),
  new RouteClass("/orderList", <OrderListPage />, false, false, true),
  new RouteClass("/salesReport", <SalesReportPage />, false, false, true),
  new RouteClass("/userSettings", <UserSettingsPage />, false, false, true),
];
