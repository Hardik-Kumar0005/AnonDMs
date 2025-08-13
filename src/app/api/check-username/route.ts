import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = { username: searchParams.get("username") };

        const validation = usernameQuerySchema.safeParse({ queryParam });
        if (!validation.success) {
            const usernameErrors = validation.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: "Invalid username",
                errors: usernameErrors
            }, { status: 400 });
        }

        const { username } = validation.data;
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (user) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 409 });
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, { status: 200 });
    }
    catch(error){
        console.error("Error checking username:", error);
        return Response.json({ 
            success: false,
            message: "Error checking username"
         }, { status: 500 });
    }
}