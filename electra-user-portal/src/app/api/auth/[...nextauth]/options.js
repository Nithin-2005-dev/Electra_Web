import { connectDb } from "@/app/database/dbConfig";
import { User } from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pages } from "next/dist/build/templates/app-page";
export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        await connectDb();

        try {
          const user = await User.findOne({ email: credentials.identifier });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("please verify your account before login");
          }
          const ispasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (ispasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
      }
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "@/components/Login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
