import prisma from "../../../../lib/prisma";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    try{
        const { email, username, password } = await request.json();
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        
        // Check for existing username
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username }
        });
        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 409 });
        }

        // Check for existing email
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "This email is already registered"
                }, { status: 409 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                await prisma.user.update({
                    where: { email: existingUserByEmail.email },
                    data: {
                        password: hashedPassword,
                        verifyCode,
                        verifyCodeExpiry: new Date(Date.now() + 3600000),
                    }
                });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: {
                        create: [{
                            content: "Welcome to NGL!",
                        }]
                    }
                }
            });
        }

            // SEND MAIL
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            if(!emailResponse) {
                return Response.json({ 
                success: false,
                message: "Failed to send verification email" }, 
                { status: 500 });
            }

            return Response.json({ 
                success: true,
                message: "Verification email sent successfully" }, 
                { status: 201 });
    }
    catch(error){
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            error: "Failed to create user"
        }, { status: 500 });
    }
}