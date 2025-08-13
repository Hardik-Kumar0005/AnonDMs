import "next-auth";

declare module "next-auth" {
    interface User{
        id: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: User;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}