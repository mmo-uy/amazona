import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../utils/db";
import { UserModel } from "../../../models";
import { verifyHashedPassword } from "../../../utils/index";
import { Role, User } from "../../../types";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      if (user) {
        token.isAdmin = user.role === Role.admin;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) {
        session!.user!.id! = token.id;
      }
      if (token?.isAdmin) {
        session!.user!.role = token.role;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        await db.connect();
        const user = await UserModel.findOne<User>({
          email: credentials?.email,
        });
        await db.disconnect();
        if (
          user &&
          verifyHashedPassword(credentials?.password!, user.password)
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: "f",
            isAdmin: user.role,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
});
