import { NextAuthOptions, Session, User } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { IExtendedJWT, IExtendedSession } from "@/utils/interfaces"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          })

          const data = await res.json()

          if (res.ok && data) {
            return data
          } else {
            return null
          }
        } catch (error) {
          console.error("Error during authentication:", error)

          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser }): Promise<JWT> {
      if (user && "token" in user) {
        token.accessToken = user.token
      }

      return token
    },
    async session({ session, token }: { session: IExtendedSession; token: IExtendedJWT }): Promise<Session> {
      session.accessToken = token.accessToken

      return session
    },
  },
}
