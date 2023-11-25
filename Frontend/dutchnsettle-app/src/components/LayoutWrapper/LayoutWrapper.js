import React from "react";
import { Poppins } from "@next/font/google";
import { Navbar } from "../Navbar/Navbar";
import { signIn, useSession } from "next-auth/react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700", "500"]
})
const LayoutWrapper = ({ children }) => {

    const { status } = useSession();
    if (status == "loading") {
        return (<div>Loading...</div>)
    }else if(status == "unauthenticated"){
        signIn("google", { callbackUrl: "http://localhost:3000/dashboard" });
    }
    else{
        return (
            <main className={poppins.className}>
                <Navbar />
                {children}
            </main>
        )
    }
}

export default LayoutWrapper