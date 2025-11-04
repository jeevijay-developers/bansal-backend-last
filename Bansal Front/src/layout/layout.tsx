import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";
import Header3 from "./header3";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  // Hide header/footer if the route starts with /dashboard
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Example: If you want to hide footer for other dynamic conditions (optional)
  // For now, let's only handle dashboard routes dynamically

  const renderHeader = () => {
    // You can keep your logic to show different headers on other routes if needed
    // For simplicity, show Header3 only on exact "/dashboard" route if you want:
    if (pathname === "/dashboard") {
      return <Header3 />;
    }
    return <Header />;
  };

  return (
    <main>
      {/* Hide header on dashboard routes */}
      {!isDashboardRoute && renderHeader()}

      {children}

      {/* Hide footer on dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </main>
  );
};

export default Layout;
