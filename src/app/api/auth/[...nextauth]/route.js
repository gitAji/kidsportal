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
      async authorize(credentials, req) {
        // Add your user validation logic here.
        // For example, you might query a database to find a user by email
        // and then compare the provided password with the stored hashed password.
        // If the credentials are valid, return a user object.
        // Otherwise, return null.

        // Placeholder for demonstration:
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          return { id: "1", name: "Test User", email: "test@example.com" };
        } else {
          return null;
        }
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