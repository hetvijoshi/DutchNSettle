import React from "react";
import { Poppins } from "@next/font/google";
import { Navbar } from "../Navbar/Navbar";
import { useSession } from "next-auth/react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700", "500"]
})
const LayoutWrapper = ({ children }) => {

    const { data: session } = useSession();
    return (
        session ? (
            <main className={poppins.className}>
                <Navbar />
                {children}
            </main>
        ) : <></>

    )
}

export default LayoutWrapper