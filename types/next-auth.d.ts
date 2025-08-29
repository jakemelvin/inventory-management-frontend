import "next-auth";
import { Session } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        firstName: string | null;
        lastName: string | null
        email?: string | null;
        role?: string;
        accessToken?: string;
        roles?: Array<{
            id: number;
            roleName: string;
            utilisateurId: number;
            entrepriseId: number;
        }>;
    }

    interface Session {
        user?: User;
        accessToken?: string;
        expires: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: string;
        accessToken?: string;
        roles?: Array<{
            id: number;
            roleName: string;
            utilisateurId: number;
            entrepriseId: number;
        }>;
    }
}


export type AuthSession = Session | null;

export type AuthenticateResult =
    | { session: Session }
    | { error: "UNAUTHENTICATED"; redirectPath: string };

export type AuthorizeResult =
    | { authorized: true }
    | { error: "UNAUTHORIZED"; redirectPath: string };