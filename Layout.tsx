// Layout.tsx
import React, { ReactNode } from 'react';
import Header from "./Reusables/Header.tsx";
import Footer from "./Reusables/Footer.tsx";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
    const { children } = props;

    return (
        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;