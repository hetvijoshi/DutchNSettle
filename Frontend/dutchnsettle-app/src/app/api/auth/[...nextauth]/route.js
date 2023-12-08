import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"
import { createUser, fetchUser } from "@/app/services/AuthService"


const authOptions = NextAuth({
    providers: [
        GoogleProvider({
            clientId: "887708871770-p3mli4kh7btf56ri42nnbveefcchqtpv.apps.googleusercontent.com",
            clientSecret: "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"
        })
    ],
    secret: "61a13d5d67bf7a9a7bdcd6f3a1b7832d",
    callbacks: {
        async signIn({ user, profile, account }) {
            if (user && account) {
                const userData = {}
                userData["name"] = profile?.name
                userData["email"] = profile?.email
                userData["picture"] = profile?.picture
                userData["firstName"] = profile?.given_name
                userData["lastName"] = profile?.family_name
                const res = await createUser(userData, account.id_token);
                user["userId"] = res.data.data._id
                return res.data.type == "success" ? true : false;
            }
            else {
                return false
            }
        },
        async jwt({ token, account }) {

            if (account) {
                const user = jwt.decode(account.id_token);
                token.id_token = account.id_token;
                token.access_token = account.access_token;
                token.firstName = user.given_name;
                token.lastName = user.family_name;
            }

            return token;
        },
        async session({ session, token }) {
            const userDetails = await fetchUser(session.user["email"], token.id_token);
            session["id_token"] = token.id_token;
            session["access_token"] = token.access_token;
            session.user["firstName"] = token.firstName;
            session.user["lastName"] = token.lastName;
            session.user["userId"] = userDetails.data.data._id
            return session;
        },
    },
})

export { authOptions as GET, authOptions as POST };