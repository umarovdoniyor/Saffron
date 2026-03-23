import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/utilities/ProtectedRoute";

import Home3Page from "./pages/homePages/Home3";

import AboutUsPage from "./pages/innerPages/AboutUsPage";
import ChefPage from "./pages/innerPages/ChefPage";
import ReservationPage from "./pages/innerPages/ReservationPage";
import ContactPage from "./pages/innerPages/ContactPage";
import RegisterPage from "./pages/innerPages/RegisterPage";
import LoginPage from "./pages/innerPages/LoginPage";
import RestaurantUserDashboard from "./pages/innerPages/RestaurantUserDashboard";
import NotFoundPage from "./pages/innerPages/NotFoundPage";

import FoodMenuPage from "./pages/FoodPage/FoodMenu";

import ShopPage from "./pages/shopPage/ShopPage";
import ShopSinglePage from "./pages/shopPage/ShopSinglePage";
import CartPage from "./pages/shopPage/CartPage";
import CheckoutPage from "./pages/shopPage/CheckoutPage";

import BlogStandardPage from "./pages/blogPages/BlogStandardPage";
import BlogWithSidebarPage from "./pages/blogPages/BlogWithSidebarPage";
import Blog2ColumnPage from "./pages/blogPages/Blog2ColumnPage";
import Blog3ColumnPage from "./pages/blogPages/Blog3ColumnPage";
import BlogSinglePage from "./pages/blogPages/BlogSinglePage";
import BlogSingleWithSidebarPage from "./pages/blogPages/BlogSingleWithSidebar";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home3Page />}></Route>

        <Route path="/about-us" element={<AboutUsPage />}></Route>
        <Route path="/chef" element={<ChefPage />}></Route>
        <Route
          path="/reservation"
          element={
            <ProtectedRoute>
              <ReservationPage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <RestaurantUserDashboard />
            </ProtectedRoute>
          }
        ></Route>

        <Route path="/food-menu" element={<FoodMenuPage />}></Route>

        <Route path="/blog-standard" element={<BlogStandardPage />}></Route>
        <Route
          path="/blog-with-sidebar"
          element={<BlogWithSidebarPage />}
        ></Route>
        <Route path="/blog-2-column" element={<Blog2ColumnPage />}></Route>
        <Route path="/blog-3-column" element={<Blog3ColumnPage />}></Route>
        <Route path="/blog-single/:id" element={<BlogSinglePage />}></Route>
        <Route
          path="/blog-single-with-sidebar/:id"
          element={<BlogSingleWithSidebarPage />}
        ></Route>

        <Route path="/shop" element={<ShopPage />}></Route>
        <Route path="/shop-single/:id" element={<ShopSinglePage />}></Route>
        <Route
          path="/shop-single-thumb/:id"
          element={<ShopSinglePage />}
        ></Route>
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </>
  );
};

export default Routers;
