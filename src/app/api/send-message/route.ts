import prisma from "@/lib/prisma";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { User } from "@prisma/client"
import { Message } from "@prisma/client";

// Request validation schema (username + content)
// const sendMessageSchema = messageSchema.extend({
//     username: z.string().min(1, { message: "Username is required" })
// });


export async function POST(request: Request) {

    const { username, content } = await request.json();

    const parsed = messageSchema.safeParse(content);
    if (!parsed.success) {
        return Response.json({
            success: false,
            message: "Invalid request",
            errors: z.treeifyError(parsed.error)
        }, { status: 400 });
    }

    try {
    const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages currently!"
            }, { status: 403 });
        }

        const message = await prisma.message.create({
            data: {
                content: parsed.data.content,
                userId: user.id
            }
        });

        return Response.json({
            success: true,
            message: message
        });
    } 
    catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "An error occurred while sending your message"
        }, { status: 500 });
    }
}