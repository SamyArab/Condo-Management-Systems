// Layout.tsx
import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

function Layout(children) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
