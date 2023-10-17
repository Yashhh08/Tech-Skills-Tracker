import RenderTag from "@/components/shared/RenderTag";
import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/sidebar/LeftSidebar";
import RightSidebar from "@/components/shared/sidebar/RightSidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative h-screen">
      <Navbar />
      <div className="flex h-screen">
        <LeftSidebar />
        <section className="flex h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}
          </div>
        </section>
        <RightSidebar />
      </div>
    </main>
  );
};

export default Layout;
