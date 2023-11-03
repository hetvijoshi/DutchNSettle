"use client";

import "./globals.css";
import React from "react";
import classes from "./layout.module.scss";
import { Navbar } from "../components/Navbar/Navbar";
import Providers from "./lib/utility/Providers";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "500"]
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${classes.remove_margin_padding}`}>
        <Providers>
          <main className={poppins.className}>
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
