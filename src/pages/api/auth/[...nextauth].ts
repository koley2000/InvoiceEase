import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from "@/lib/prisma";

// Create Prisma client instance
// const prisma = new PrismaClient();

declare module "next-auth" { 
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found");
        }

        const valid = await argon2.verify(user.password, credentials.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        // ✅ Return user object
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 120 * 60, // 120 minutes
  },

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
            ? '__Secure-next-auth.session-token' 
            : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // CRITICAL: Leaving 'maxAge' undefined makes it a Session Cookie
        // The browser will delete it when the browser is closed.
      }
    }
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  pages: {
    signIn: "/login",
    signOut: "/",
  },

  // Callbacks for JWT and Session
  callbacks: { 
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Ensure redirects land on home for signOut and unauth cases
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If redirecting to signin or error, keep default behavior
      return baseUrl;
    },
  },
};


export default NextAuth(authOptions);
