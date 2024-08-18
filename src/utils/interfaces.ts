import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

export interface IExtendedSession extends Session {
  accessToken?: string
}

export interface IExtendedJWT extends JWT {
  accessToken?: string
}
