"use client";

import "./globals.css";
import React from "react";
import classes from "./layout.module.scss";
import { Navbar } from "./Navbar/Navbar";
import Providers from "./utility/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${classes.remove_margin_padding}`}>
        <Providers>
          <main>
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
