import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    // Keep Vipps login here if it's configured as a NextAuth provider
    // For example:
    // VippsProvider({
    //   clientId: process.env.VIPPS_CLIENT_ID,
    //   clientSecret: process.env.VIPPS_CLIENT_SECRET,
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };