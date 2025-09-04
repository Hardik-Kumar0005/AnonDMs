import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function POST(request: Request) {
    try{
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(code);
        const user = await prisma.user.findUnique({
            where: { 
                username: decodedUsername
            }
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Verify the code (this is just a placeholder, implement your own logic)
        const isValidCode = user.verifyCode === code; 
        const isNotExpired = new Date(user.verifyCodeExpiry as Date) > new Date();

        if (isValidCode && isNotExpired) {
            await prisma.user.update({
                where: { username: decodedUsername },
                data: {
                    isVerified: true,
                }
            });
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 });
        }

        else if(!isNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired. Signup again!"
            }, { status: 410 });
        }

        else {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 401 });
        }

    }
    catch(error){
        console.error("Error verifying code:", error);
        return Response.json({
            success: false,
            message: "Error verifying code"
        }, { status: 500 });
    }
}