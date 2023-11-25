import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"
import { createUser, fetchUser } from "@/app/services/AuthService"



// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
const GOOGLE_CLIENT_ID = "887708871770-p3mli4kh7btf56ri42nnbveefcchqtpv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
const authOptions = NextAuth({
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID ?? " ",
            clientSecret: GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
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
            else{
                return false
            }
        },
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin

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
            // Send properties to the client, like an access_token from a provider.
            console.log("Email-",session.user)
            const userDetails = await fetchUser(session.user["email"], token.id_token);
            console.log("----userdetails:",userDetails)
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