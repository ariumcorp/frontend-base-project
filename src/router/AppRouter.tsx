import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AnimatedPage from "@/components/AnimatedPage";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const HomePage = () => <h1>Página de Inicio (Dashboard)</h1>;
const ProductsPage = () => <h1>Página de Productos</h1>;

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={
              <AnimatedPage>
                <LoginPage />
              </AnimatedPage>
            }
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <AnimatedPage>
                  <HomePage />
                </AnimatedPage>
              }
            />
            <Route
              path="products"
              element={
                <AnimatedPage>
                  <ProductsPage />
                </AnimatedPage>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
