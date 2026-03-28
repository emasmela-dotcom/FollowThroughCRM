import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { sql } = await import("./db");
          const rows = await sql`
          SELECT id, email, password_hash FROM users WHERE email = ${credentials.email} LIMIT 1
        `;
          const user = rows[0];
          if (!user) return null;
          const ok = await bcrypt.compare(credentials.password, user.password_hash as string);
          if (!ok) return null;
          return { id: String(user.id), email: user.email as string };
        } catch (e) {
          console.error("[auth] authorize failed", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

function isDynamicServerUsage(e: unknown): boolean {
  if (typeof e !== "object" || e === null) return false;
  const d = (e as { digest?: string }).digest;
  if (d === "DYNAMIC_SERVER_USAGE") return true;
  const msg = (e as Error).message;
  return typeof msg === "string" && msg.includes("Dynamic server usage");
}

/**
 * Safe session read for request time. Rethrows Next.js dynamic hints (do not catch those).
 * Returns null only on real session/JWT failures so pages don’t 500 from bad cookies or secret mismatch.
 */
export async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (e) {
    if (isDynamicServerUsage(e)) throw e;
    console.error("[getSession] getServerSession failed", e);
    return null;
  }
}

declare module "next-auth" {
  interface Session {
    user: { id?: string; email?: string | null; name?: string | null; image?: string | null };
  }
}
