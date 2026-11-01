import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // Real account creation/sign-in goes through Firebase Auth
        // (src/firebase/auth.js) — nothing in the app calls next-auth's
        // signIn("credentials", ...), so this provider has no real user
        // store to check against. It used to accept a hardcoded
        // test@example.com / password combo as unfinished tutorial
        // scaffolding, which was a live backdoor; disabled until it's
        // wired up to an actual credential store.
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Specify your custom login page
    // You can also specify other pages like signOut, error, verifyRequest, newUser
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };