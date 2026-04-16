import NextAuth, { DefaultSession } from "next-auth";

// Mở rộng typing NextAuth để include ID
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}
