"use client";

import "./globals.css";
import React from "react";
import classes from "./layout.module.scss";
import Providers from "./lib/utility/Providers";
import LayoutWrapper from "@/components/LayoutWrapper/LayoutWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${classes.remove_margin_padding}`}>
        <Providers>
          {/* <main className={poppins.className}>
            <Navbar />
            {children}
          </main> */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
