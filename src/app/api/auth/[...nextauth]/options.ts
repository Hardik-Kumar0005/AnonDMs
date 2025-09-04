import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from  "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
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
                    
                    const isValid = await bcrypt.compare(credentials.password, user.password as string);
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
    events: {
        async createUser({ user }) {
            // This runs after a user is created via OAuth
            if (user.email) {
                try {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            username: user.email.split('@')[0], // Generate username from email
                            isVerified: true, // OAuth users are pre-verified
                            isAcceptingMessages: true,
                            messages: {
                                create: [{
                                    content: "Welcome to NGL!",
                                }]
                            }
                        }
                    });
                } catch (error) {
                    console.error("Error updating new OAuth user:", error);
                }
            }
        }
    },
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