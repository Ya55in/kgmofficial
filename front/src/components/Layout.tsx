import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
  disableNavbarOffset?: boolean;
  hideNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  mainClassName = '',
  disableNavbarOffset = false,
  hideNavbar = false,
}) => {
  const shouldApplyOffset = !hideNavbar && !disableNavbarOffset;
  const basePadding = shouldApplyOffset ? 'pt-20' : '';

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className={`${basePadding} ${mainClassName}`.trim()}>
        {children}
      </main>
    </div>
  );
};

export default Layout;