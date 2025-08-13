import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from  "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                username: {label: "Username", type: "text", placeholder: "your-username"},
                password: {label: "Password", type: "password", placeholder: "your-password"}
            },
            async authorize(credentials: any): Promise<any>{
                try{
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: credentials.identifier },
                                { username: credentials.identifier }
                            ]
                        }
                    });

                    if(!user) {
                        throw new Error("User doesn't exist");
                    }

                    if(!user.isVerified) {
                        throw new Error("You need to verify your account first! Check your email");
                    }
                    
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if(!isValid) {
                        throw new Error("Invalid credentials");
                    }
                    return user;
                }
                catch(err: any){
                    throw new Error(err.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user.id = token.id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
                session.user.username = token.username as string;
                }
                return session;
            },
    },
    pages: {
        signIn: '/signin',
        signOut: '/signout',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
}